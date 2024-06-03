import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyTokenEmployee,upload, validate } from "../app/middleware/common";

import * as employeeRequest from "../app/requests/employee.request";
import * as employeeMiddleware from "../app/middleware/employee.middleware";
import * as employeeController from "../app/controllers/employee.controller";

const router = Router();

//login
router.post(
    "/login",
    asyncHandler(validate(employeeRequest.login)),
    asyncHandler(employeeController.login)
);

//get me
router.get(
    "/me",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeController.getMe)
);

//list all employees. checked
router.get(
    "/",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(validate(employeeRequest.readRoot)),
    asyncHandler(employeeController.getAllEmployees)
);

//list 1 employee by id. checked
router.get(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeMiddleware.checkEmployeeId),
    asyncHandler(employeeController.getAnEmployee)
);

//create a new employee. checked
router.post(
    "/",
    asyncHandler(verifyTokenEmployee), 
    asyncHandler(upload), 
    asyncHandler(validate(employeeRequest.createEmployee)),
    asyncHandler(employeeController.createAnEmployee)
);

//update 1 employee. checked
router.put(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(upload),
    asyncHandler(employeeMiddleware.checkEmployeeId),
    asyncHandler(validate(employeeRequest.updateAnEmployee)),
    asyncHandler(employeeController.updateAnEmployee),
);

//delete 1 employee. checked
router.delete(
    "/:id",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeMiddleware.checkEmployeeId),
    asyncHandler(employeeController.deleteAnEmployee)
);
 
 
//logout
router.post(
    "/logout",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeController.logout)
);

//update 1 field password. checked
router.patch(
    "/:id/reset-password",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeMiddleware.checkEmployeeId),
    asyncHandler(validate(employeeRequest.resetPassword)),
    asyncHandler(employeeController.resetPassword),
);

//soft delete 1 employee.
router.patch(
    "/:id/soft-delete",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeMiddleware.checkEmployeeId),
    asyncHandler(employeeController.softDeleteAnEmployee)
);

//restore 1 employee.
router.patch(
    "/:id/restore",
    asyncHandler(verifyTokenEmployee),
    asyncHandler(employeeController.restoreAnEmployee)
);

//send email
router.post(
    "/send-email",
    asyncHandler(employeeMiddleware.checkEmail),
    asyncHandler(employeeController.sendEmail)
); 

//update password by email
router.post(
    "/update-password/:token",
    asyncHandler(validate(employeeRequest.updatePassword)),
    asyncHandler(employeeMiddleware.checkToken),
    asyncHandler(employeeController.updatePassword)
);

export default router;
