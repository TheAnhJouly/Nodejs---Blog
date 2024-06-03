import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {upload, validate , verifyTokenEmployee} from "../app/middleware/common";

import * as authorController from "../app/controllers/author.controller";
import * as authorRequest from "../app/requests/author.request";
import * as authorMiddleware from "../app/middleware/author.middleware";
const router = Router();


//lists all authors. checked
router.get(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(validate(authorRequest.readRoot)),
    asyncHandler(authorController.getAuthors)
);

//list an author. checked
router.get(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(authorController.getAnAuthor)
);

//create a new author. checked
router.post(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(upload), 
    asyncHandler(validate(authorRequest.createAuthor)),
    asyncHandler(authorController.createAuthor)
);

//update an author. checked
router.put(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(upload),
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(validate(authorRequest.updateAnAuthor)),
    asyncHandler(authorController.updateAnAuthor)
);

//delete an author.checked 
router.delete(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(authorController.deleteAnAuthor)
); 

//delete many authors. checked
// router.delete(
//     "/",
//     asyncHandler(verifyTokenEmployee),
//     asyncHandler(validate(authorRequest.deleteAuthors)),
//     asyncHandler(authorController.deleteAuthors)
// );

export default router;
