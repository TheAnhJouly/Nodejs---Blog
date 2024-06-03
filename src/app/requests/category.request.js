import Joi from "joi";
import {Category} from "../models";
import {MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";

//check if the category exists
export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),//chuỗi tìm kiếm 
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),// số trang cần lấy
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20), // số lượng item trên 1 trang
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),// trường cần sắp xếp
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),// thứ tự sắp xếp 
}).unknown(true); //unknown cho phép các trường khác không được định nghĩa ở trên

export const createCategory = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tên danh mục"),
    description: Joi.string()
        .trim()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const category = await Category.findOne({description: value});
                    return !category ? value : helpers.error("any.exists");
                }),
        ),
});

export const updateCategory = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tên danh mục"),
    description: Joi.string()
        .trim()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const categoryId = req.params.id;
                    const category = await Category.findOne({description: value, _id: {$ne: categoryId}});
                    return !category ? value : helpers.error("any.exists");
                }),
        ),
});
