import {ObjectId,createModel} from "./base"; 

export const Post = createModel("Post", "posts", {
    author_id: {
        type: ObjectId,
        ref: "Author",
        required: true,
    },
    categories: [{
        type: ObjectId,
        ref: "Category",
        required: true,
    }],
    title: {
        type: String,
        required: true, 
        maxlength: 255,
    },
    content: {
        type: String,
        required: true,
    },
});
