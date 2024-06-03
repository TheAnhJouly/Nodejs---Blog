import jwt from "jsonwebtoken";
import {Employee} from "../models";
import {cache, JWT_EXPIRES_IN, LINK_STATIC_URL, TOKEN_TYPE, APP_URL_API} from "@/configs";
import {comparePassword, generateToken, generatePassword, sendMail} from "@/utils/helpers";
import moment from "moment";
import crypto from "crypto";

export const tokenBlocklist = cache.create("token-block-list");

//get me
export async function getMe(employee_id) {
    const employee = await Employee.findById(employee_id, {password: 0});
    if (employee.avatar) {
        employee.avatar = LINK_STATIC_URL + employee.avatar;
    }
    return employee;
} 

//get all employees. tìm kiếm và phân trang
export async function filter({q, page, per_page, column, order,status}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {avatar: q}, {email: q}, {phone: q}, {bio: q}]}),
        ...(status && {status: status} )  
    };

    const employees = (
        await Employee.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[column]: order})
    ).map((employee) => {
        if (employee.avatar) {
            employee.avatar = LINK_STATIC_URL + employee.avatar;
        }
        return employee;
    });

    const total = await Employee.countDocuments(filter);
    return {total, page, per_page,status, employees};
}

//get an employee
export async function details(employeeId) {
    const employee = await Employee.findById(employeeId, {password: 0}); //password không được trả về
    employee.avatar = LINK_STATIC_URL + employee.avatar;
    return employee;
}
//create a new employee
export async function create({password, name, avatar, email, phone, status}) {
    const employee = new Employee({
        password: generatePassword(password),
        name,
        avatar,
        email,
        phone,
    });
    await employee.save();
    return employee;
}

//update an employee
export async function update(employeeId, {name, avatar, email, phone, status}) {
    employeeId.name = name;
    employeeId.avatar = avatar;
    employeeId.email = email;
    employeeId.phone = phone;
    employeeId.status = status;
    await employeeId.save();
    return employeeId;
}

//delete an employee
export async function remove(employeeId) {
    await Employee.deleteOne({_id: employeeId._id});
}

//login

export async function checkValidLogin({email, password}) {
    const employee = await Employee.findOne({
        email: email,
        deleted_at: null,
    });

    if (employee) {
        const verified = comparePassword(password, employee.password);
        if (verified) {
            return employee;
        }
    }

    return false;
}

export function authToken(employee_id) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, {employee_id}, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function profile(employee_id) {
    const employee = await Employee.findOne({_id: employee_id}, {password: 0});
    if (employee.avatar) {
        employee.avatar = LINK_STATIC_URL + employee.avatar;
    }

    return employee;
}

//reset password
export async function resetPassword(employee, new_password) {
    employee.password = generatePassword(new_password);
    await employee.save();
    return employee;
}

//soft delete an employee
export async function softDelete(employee) {
    await Employee.updateOne({_id: employee._id}, {status:"inactive", deleted_at: new Date()});
}
//restore an employee
export async function restore(id) {
    await Employee.updateOne({_id: id}, {status:"active", deleted_at: ""});
}


export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}

//send email
export async function sendEmail(employee) {
    // Generate reset password token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex"); // tạo token ngẫu nhiên 20 ký tự bằng hex
    const resetPasswordExpires = Date.now() + 3600000; // expires in an hour

    // Save reset password token
    employee.resetPasswordToken = resetPasswordToken;
    employee.resetPasswordExpires = resetPasswordExpires;
 
    await employee.save();

    // Send reset password email
    const resetUrl = APP_URL_API + `/employee/update-password/${resetPasswordToken}`;
    const subject = "Password Reset"; // tiêu đề email
    const template = "resetPassword"; // tên file template email
    const data = {resetUrl}; // dữ liệu truyền vào template email

    try {
        await sendMail(employee.email, subject, template, data); // gọi hàm sendMail
    } catch (error) {
        employee.resetPasswordToken = null; // nếu gửi email thất bại thì reset lại token
        employee.resetPasswordExpires = null; // nếu gửi email thất bại thì reset lại token
        await employee.save();
    }
}

//update password
export async function updatePassword(employee, new_password) {
    employee.password = generatePassword(new_password);
    employee.resetPasswordToken = null;
    employee.resetPasswordExpires = null;
    await employee.save();
    return employee;
}
