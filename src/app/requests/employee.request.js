import Joi from "joi";
import {Employee, Author} from "../models";
import {VALIDATE_PHONE_REGEX,MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate,FileUpload} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";
 
//check if the employee exists
export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),//chuỗi tìm kiếm 
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),// số trang cần lấy
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20), // số lượng item trên 1 trang
    column: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),// trường cần sắp xếp
    order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),// thứ tự sắp xếp 
}).unknown(true); //unknown cho phép các trường khác không được định nghĩa ở trên

 
export const createEmployee = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .allow("")
        .lowercase()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const employee = await Employee.findOne({email: value});
                    const author = await Author.findOne({email: value});
                    return !employee && !author ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const employeeId = req.params.id;
                    const employee = await Employee.findOne({phone: value, _id: {$ne: employeeId}});
                    const author = await Author.findOne({phone: value });
                    return !employee && !author ? value : helpers.error("any.exists");
                }),
        ),
    status: Joi.valid("active", "inactive").default("active").label("Trạng thái tài khoản"),
}); 

//update an employee
export const updateAnEmployee = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const employeeId = req.params.id;
                    const employee = await Employee.findOne({email: value, _id: {$ne: employeeId}});
                    return !employee ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const employeeId = req.params.id;
                    const employee = await Employee.findOne({phone: value, _id: {$ne: employeeId}});
                    return !employee ? value : helpers.error("any.exists");
                }),
        ),
    status: Joi.valid("active", "inactive").label("Trạng thái tài khoản"),
});

//login 
export const login = Joi.object({
    email: Joi.string().trim().max(MAX_STRING_SIZE).lowercase().email().required().label("Email"),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

//reset password
export const resetPassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    new_password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

//update password by email
export const updatePassword = Joi.object({
    new_password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});


