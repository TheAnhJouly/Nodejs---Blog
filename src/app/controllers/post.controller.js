import {responseSuccess} from "@/utils/helpers";
import * as postService from "../services/post.service";  

//get all posts
export async function getPosts(req, res) {
    return responseSuccess(res, await postService.filter(req.query));
}

//get a post by id
export async function getAPost(req, res) {
    await responseSuccess(res,await postService.getPostById(req.params.id));
}
 

//create a new post
export async function createAPost(req, res) {
    await postService.create(req.body);
    return responseSuccess(res, null, 201);
}
 
//update a post
export async function updateAPost(req, res) {
    await postService.update(req.post, req.body);
    return responseSuccess(res, null, 201);
}

//delete a post
export async function deleteAPost(req, res) {
    await postService.remove(req.params.id);
    return responseSuccess(res);
}