import {responseSuccess} from "@/utils/helpers";
import * as categoryService from "../services/category.service"; 

// Get all categories
export async function getCategories(req, res) {
    return responseSuccess(res, await categoryService.filter(req.query));
}

// Get a category
export async function getCategory(req, res) {
    await responseSuccess(res, await categoryService.getCategoryById(req.params.id));
}

// Create a new category
export async function createCategory(req, res) {
    await categoryService.create(req.body);
    return responseSuccess(res, null, 201);
}

// Update a category
export async function updateCategory(req, res) {
    await categoryService.update(req.category, req.body);
    return responseSuccess(res, null, 201);
}

// Delete a category
export async function deleteCategory(req, res) {
    await categoryService.remove(req.category);
    return responseSuccess(res);
}