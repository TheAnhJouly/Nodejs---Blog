import {responseSuccess} from "@/utils/helpers";
import * as authorService from "../services/author.service";

//get all authors
export async function getAuthors(req, res) {
    return responseSuccess(res, await authorService.filter(req.query));
}

//get an author
export async function getAnAuthor(req, res) {
    await responseSuccess(res, await authorService.details(req.params.id));
}

//create a new author. checked
export async function createAuthor(req, res) { 
    await authorService.create(req.body);
    return responseSuccess(res, null, 201);
}
 
//update an author
export async function updateAnAuthor(req, res) {
    await authorService.update(req.author, req.body);
    return responseSuccess(res, null, 201);
}

//delete an author
export async function deleteAnAuthor(req, res) {
    await authorService.remove(req.author);
    return responseSuccess(res);
}
