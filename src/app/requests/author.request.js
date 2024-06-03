import Joi from "joi";
import {Author, Employee} from "../models";
import {VALIDATE_PHONE_REGEX,MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate,FileUpload} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";

//check if the category exists
export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),//chuỗi tìm kiếm 
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),// số trang cần lấy
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20), // số lượng item trên 1 trang
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),// trường cần sắp xếp
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),// thứ tự sắp xếp 
}).unknown(true); //unknown cho phép các trường khác không được định nghĩa ở trên

export const createAuthor = Joi.object({
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
        .label("Ảnh đại diện")
        .required(),
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .label("Email")
        .allow("")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const author = await Author.findOne({email: value});
                    const employee = await Employee.findOne({email: value});
                    return !author && !employee ? value : helpers.error("any.exists");
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
                    const authorId = req.params.id;
                    const author = await Author.findOne({phone: value, _id: {$ne: authorId}});
                    const employee = await Employee.findOne({phone : value}); 
                    return !author && !employee ? value : helpers.error("any.exists");
                }),
        ),
    bio: Joi.string()
        .trim()
        .allow("")
        .label("Tiểu sử"),
    
});

export const updateAnAuthor = Joi.object({
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
        .label("Ảnh đại diện")
        .required(),
    email: Joi.string()
        .trim()
        .email() 
        .label("Email")
        .allow("")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const author = await Author.findOne({email: value, _id: {$ne: req.author._id}});
                    return !author ? value : helpers.error("any.exists");
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
                    const authorId = req.params.id;
                    const author = await Author.findOne({phone: value, _id: {$ne: authorId}});
                    return !author ? value : helpers.error("any.exists");
                }),
        ),
    bio: Joi.string()
        .trim()
        .allow("")
        .label("Tiểu sử"),
    
});
