import {isValidObjectId} from "mongoose";
import {responseError, getToken} from "@/utils/helpers";
import {Employee} from "@/app/models";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "@/configs";

export const checkEmployeeId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const employee = await Employee.findOne({_id});
        if (employee) {
            if (employee.status === "inactive") {
                return responseError(res, 400, "Bạn đã bị khóa tài khoản");
            }
            req.employee = employee;
            return next();
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};

//kiểm tra xem người dùng có quyền truy cập không
export async function authMiddleware(req, res, next) {
    // Get the employee's token from the headers
    const token = getToken(req.headers);
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        // Verify the token and get the employee's id
        const decoded = jwt.verify(token, SECRET_KEY);
        req.employee = decoded;

        // Find the employee in the database
        const employee = await Employee.findById(req.employee._id);
        if (!employee) return res.status(400).send("Invalid employee.");

        // Check if the employee is active
        if (employee.status !== "active") return res.status(403).send("Access denied. Employee is inactive.");

        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
}

//check email
export const checkEmail = async function (req, res, next) {
    const {email} = req.body;
    if (email) {
        const employee = await Employee.findOne({email});
        if (employee) {
            if (employee.status === "inactive") {
                return responseError(res, 400, "Bạn đã bị khóa tài khoản");
            }
            req.employee = employee;
            return next();
        }
    }
    return responseError(res, 404, "Người dùng không tồn tại");
};

//
export const checkToken = async function (req, res, next) {
    const token = req.params.token;
    if (token) {
        const employee = await Employee.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()},
        });
        if (token === employee.resetPasswordToken) {
            if (employee.resetPasswordExpires > Date.now()) {
                req.employee = employee;
                return next();
            } else {
                return responseError(res, 400, "Token hết hạn");
            }
        }
    }
    return responseError(res, 400, "Token không tồn tại");
};
