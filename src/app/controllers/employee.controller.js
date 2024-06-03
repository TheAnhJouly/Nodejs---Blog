import {responseSuccess, responseError, getToken} from "@/utils/helpers";
import * as EmployeeService from "../services/employee.service";
import * as AuthService from "../services/author.service";

//get me
export async function getMe(req, res) {
    return responseSuccess(res, await EmployeeService.getMe(req.currentEmployee._id));
}

//get all employees
export async function getAllEmployees(req, res) { 
    return responseSuccess(res, await EmployeeService.filter(req.query));
}

//get an employee
export async function getAnEmployee(req, res) {
    await responseSuccess(res, await EmployeeService.details(req.params.id));
}

//create a new employee 
export async function createAnEmployee(req, res) {  
    const newEmployee = await EmployeeService.create(req.body); 
    EmployeeService.authToken(newEmployee._id);
    return responseSuccess(res, null, 201, "Đăng ký thành công");
}

//update an employee
export async function updateAnEmployee(req, res) {
    await EmployeeService.update(req.employee, req.body);
    return responseSuccess(res, null, 201);
}
 
//delete an employee
export async function deleteAnEmployee(req, res) {
    await EmployeeService.remove(req.employee);
    return responseSuccess(res);
}

//login 
export async function login(req, res) {
    const validLogin = await EmployeeService.checkValidLogin(req.body);
    // kiểm tra inactive của employee
    if (validLogin.status === "inactive") {
        return responseError(res, 400, "Tài khoản của bạn đã bị khóa");
    }
    if (validLogin) {
        return responseSuccess(res, EmployeeService.authToken(validLogin._id));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không đúng");
    }
}

//logout
export async function logout(req, res) {
    const token = getToken(req.headers);
    await AuthService.blockToken(token);
    return responseSuccess(res);
}


//reset password
export async function resetPassword(req, res) {
    await EmployeeService.resetPassword(req.employee, req.body.new_password);
    return responseSuccess(res, null, 201);
}

//soft delete an employee
export async function softDeleteAnEmployee(req, res) {
    await EmployeeService.softDelete(req.employee);
    return responseSuccess(res);
}

//restore an employee
export async function restoreAnEmployee(req, res) {
    await EmployeeService.restore(req.params.id);
    return responseSuccess(res);
}

//send email
export async function sendEmail(req, res) {
    await EmployeeService.sendEmail(req.employee);
    return responseSuccess(res);
}

//update password
export async function updatePassword(req, res) {
    await EmployeeService.updatePassword(req.employee ,req.body.new_password);
    return responseSuccess(res, null, 201);
}

