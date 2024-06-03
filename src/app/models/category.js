import {ObjectId,createModel} from "./base";

export const Category = createModel("Category", "categories", {
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    post_ids: [{
        type: ObjectId,
        ref: "Post",
    }],
});
