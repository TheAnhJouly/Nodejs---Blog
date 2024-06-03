import {ObjectId,createModel} from "./base";

export const Author = createModel("Author", "authors", {
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10,
        unique: true,
    },
    bio: {
        type: String,
        default: null,
    }, 
    categories: [{
        type: ObjectId,
        ref: "Category",
        required: true,
    }],
    post_ids: [{
        type: ObjectId,
        ref: "Post",
    }],
});
