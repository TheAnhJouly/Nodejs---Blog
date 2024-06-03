import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {validate, verifyTokenEmployee } from "../app/middleware/common";

import * as categoryController from "../app/controllers/category.controller";
import * as categoryRequest from "../app/requests/category.request";
import * as categoryMiddleware from "../app/middleware/category.middleware";
const router = Router();
  
//list all categories. checked
router.get(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(validate(categoryRequest.readRoot)),
    asyncHandler(categoryController.getCategories)
);
//list 1 category by id. checked
router.get(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.getCategory)
);  

//create a new category. checked
router.post(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(validate(categoryRequest.createCategory)),
    asyncHandler(categoryController.createCategory)
);
//update a category by id. checked
router.put(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(validate(categoryRequest.updateCategory)),
    asyncHandler(categoryController.updateCategory),
); 

//delete a category. checked 
router.delete(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.deleteCategory)
);  

 
export default router;