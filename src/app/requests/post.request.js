import Joi from "joi";
import {MAX_STRING_SIZE} from "@/configs";
import {tryValidateOrDefault} from "@/utils/helpers";
import {Author, Category} from "../models";

//check if the post exists
export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),//chuỗi tìm kiếm 
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),// số trang cần lấy
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20), // số lượng item trên 1 trang
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),// trường cần sắp xếp
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),// thứ tự sắp xếp 
}).unknown(true); //unknown cho phép các trường khác không được định nghĩa ở trên

//create a new post
export const createPost = Joi.object({
    author_id: Joi.string().trim().required().label("ID tác giả"),
    //items là các phần tử trong mảng 
    categories: Joi.array().items(Joi.string()).required().label("Categories"),
    title: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tiêu đề"),
    content: Joi.string().trim().required().label("Nội dung"),
});

//update a post
export const updateAPost = Joi.object({
    author_id: Joi.string().trim().required().label("ID tác giả")
        .external(async (author_id) => {
            const author = await Author.findById(author_id);
            if (!author) {
                throw new Error("Author not found");
            }
        }),
    //items là các phần tử trong mảng 
    categories: Joi.array().items(Joi.string()).required().label("Categories")
        .external(async (categories) => {
            const categoryCount = await Category.countDocuments({ _id: { $in: categories } });
            if (categoryCount !== categories.length) {
                throw new Error("One or more categories not found");
            }
        }), 
    title: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tiêu đề"),
    content: Joi.string().trim().required().label("Nội dung"),
});

