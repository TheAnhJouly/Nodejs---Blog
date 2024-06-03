import { Category, Post } from "../models"; 
import {LINK_STATIC_URL} from "@/configs";

// Get all categories
export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {description: q}]}),
    };

    const categories = (
        await Category.find(filter, {password: 0})
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((category) => {
        if (category.avatar) {
            category.avatar = LINK_STATIC_URL + category.avatar;
        }
        return category;
    });

    const total = await Category.countDocuments(filter);
    return {total, page, per_page, categories};
} 

// Get a category by id
export async function getCategoryById(id) {
    const category = await Category.findById(id);
    return category;
}


// Create a new category
export async function create({name, description}) {
    const category = new Category({
        name,
        description,
    });
    await category.save();
    return category;
}

// Update a category 
export async function update(currentCategory, {name, description,post_ids}) {
    currentCategory.name = name;
    currentCategory.description = description;
    currentCategory.post_ids = post_ids;
    await currentCategory.save();
    return currentCategory;
}

// Delete a category
export async function remove(category) {
    // remove references
    await Post.updateMany(
        { categories: { $in: [category._id] } },
        { $pull: { categories: category._id } }
    );

    await Category.deleteOne({_id: category._id});
}



