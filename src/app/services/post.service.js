import { Post , Category} from "../models"; 
import {LINK_STATIC_URL} from "@/configs";

//get all posts 
export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{title: q}, {content: q}]}),
    };

    const posts = (
        await Post.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((post) => {
        if (post.avatar) {
            post.avatar = LINK_STATIC_URL + post.avatar;
        }
        return post;
    });

    const total = await Post.countDocuments(filter);
    return {total, page, per_page, posts};
}

//get a post by id
export async function getPostById(id) {
    const post = await Post.findById(id);
    return post;
}

//create a new post
export async function create({title, content,categories, author_id}) {
    const post = new Post({
        title,
        content,
        categories: categories,
        author_id
    });
    const result = await post.save();

    // cập nhật post_ids của category
    //.map tạo ra mảng các promise trả về từng category
    //_id: category : tìm ra category có id = category
    // $push: {post_ids: result._id} : thêm id của post vào mảng post_ids của category
    Promise.all(categories.map(async (category) => {
        await Category.findByIdAndUpdate({_id: category}, {$push: {post_ids: result._id}});
    })); 
    //Promise.all chờ tất cả các promise trong mảng categories.map chạy xong mới chạy tiếp
    return post;
}
 
// update a post 
export async function update(currentPost, {title, content, categories, author_id}) {
    currentPost.title = title;
    currentPost.content = content;
    currentPost.categories = categories;
    currentPost.author_id = author_id;
    await currentPost.save();

    // Loại bỏ id của post trong mảng post_ids khỏi các danh mục
    // $nin: categories :tìm category không nằm trong mảng categories,
    // post_ids: currentPost._id : id của post
    // $pull: {post_ids: currentPost._id} : loại bỏ id của post khỏi mảng post_ids của category
    // tổng kết : loại bỏ id của post khỏi mảng post_ids của các category không nằm trong mảng categories được truy vấn
    await Category.updateMany(
        {_id: {$nin: categories}, post_ids: currentPost._id},
        {$pull: {post_ids: currentPost._id}},
    );

    // Thêm post_ids vào các danh mục mới
    // tìm category có id trong mảng categories
    // $addToSet: {post_ids: currentPost._id} : thêm id của post vào mảng post_ids của category
    //add to set : thêm vào mảng nếu chưa tồn tại 
    await Category.updateMany(
        {_id: {$in: categories}},
        {$addToSet: {post_ids: currentPost._id}},
    );
}

//delete a post
export async function remove(post) {
    const postResult = await Post.findOne({_id: post});
    // remove references
    Promise.all(postResult.categories.map(async (category) => {
        await Category.findByIdAndUpdate({_id: category}, {$pull: {post_ids: postResult._id}});
    }));
    
    
    // await Category.updateMany(
    //     { _id: { $in: post.categories } },
    //     { $pull: { post_ids: postResult._id } }
    // );
    
    return await Post.deleteOne({_id: post});
}