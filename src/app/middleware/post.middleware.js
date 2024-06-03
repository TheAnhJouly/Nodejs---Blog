import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {Post} from "@/app/models";
 
export const checkPostId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const post = await Post.findOne({_id});
        if (post) {
            req.post = post;
            return next();
        }
    }
 
    return responseError(res, 404, "Bài viết không tồn tại hoặc đã bị xóa");
};
