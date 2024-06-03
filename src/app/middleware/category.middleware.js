import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {Category} from "@/app/models";

export const checkCategoryId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const category = await Category.findOne({_id});
        if (category) {
            req.category = category;
            return next();
        }
    }

    return responseError(res, 404, "Danh mục không tồn tại hoặc đã bị xóa");
};

export const checkManyCategoryIds = async function (req, res, next) {
    const categories = req.body.categories; 
    if(categories){
        for(const categoryId of categories){
            if (!isValidObjectId(categoryId)) {
                return responseError(res, 400, "ID danh mục không hợp lệ");
            }
            const category = await Category.findOne({_id: categoryId});
            if(!category){
                return responseError(res, 400, "Danh mục không tồn tại hoặc đã bị xóa");
            }
            
        }
    }
    next();
};