import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {validate, verifyTokenEmployee} from "../app/middleware/common";

import * as postRequest from "../app/requests/post.request";
import * as postMiddleware from "../app/middleware/post.middleware";
import * as postController from "../app/controllers/post.controller";
import { checkAuthorId } from "@/app/middleware/author.middleware";
import { checkManyCategoryIds } from "@/app/middleware/category.middleware";
const router = Router();
 

//list all posts
router.get(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(validate(postRequest.readRoot)),
    asyncHandler(postController.getPosts)
);

//list a post by id
router.get(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(postController.getAPost)
);

//create a new post
router.post( 
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(checkAuthorId),
    asyncHandler(checkManyCategoryIds), 
    asyncHandler(validate(postRequest.createPost)),
    asyncHandler(postController.createAPost) 
);

//update a post
router.put(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(validate(postRequest.updateAPost)),
    asyncHandler(postController.updateAPost)
);

//delete a post
router.delete(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(postController.deleteAPost)
);

export default router;