import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {Author} from "@/app/models";

export const checkAuthorId = async function (req, res, next) {
    const _id = req.body.author_id || req.params.id;
    if (isValidObjectId(_id)) {
        const author = await Author.findOne({_id});
        if (author) {
            req.author = author;
            return next();
        }
    }

    return responseError(res, 404, "Tác giả không tồn tại hoặc đã bị xóa");
};
