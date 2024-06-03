import { Author, Post, Category } from "../models";
import {cache,LINK_STATIC_URL} from "@/configs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const tokenBlocklist = cache.create("token-block-list");

//get all authors. tìm kiếm & phân trang 
export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;// q là chuỗi tìm kiếm. q tồn tại -> sẽ được chuyển thành regex, không thì null
    //regex: tìm kiếm chuỗi chứa q, $options: "i" -> không phân biệt chữ hoa chữ thường

    //q tồn tại -> tìm kiếm theo name, avatar, email, phone, bio khớp với q
    const filter = {
        ...(q && {$or: [{name: q},{avatar: q}, {email: q}, {phone: q}, {bio: q}]}),
    };

    //mảng authors chứa các tác giả tìm được
    const authors = (
        await Author.find(filter)//hàm find trả về mảng các tác giả thỏa mãn điều kiện filter 
            //skip và limit dùng để phân trang
            //skip: bỏ qua (page - 1) * per_page tác giả đầu tiên
            //limit: giới hạn số lượng tác giả trả về
            //sort: sắp xếp theo field và sort_order
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((author) => {
        if (author.avatar) { // mỗi tác giả trong mảng authors sẽ được chuyển đổi để thêm URL cho avatar (nếu có)
            author.avatar = LINK_STATIC_URL + author.avatar;
        }
        return author;
    });

    //đếm tổng số tác giả thỏa mãn điều kiện filter
    const total = await Author.countDocuments(filter);
    return {total, page, per_page, authors};
}

//get an author
export async function details(authorId) {
    const author = await Author.findById(authorId, {password: 0}); //password không được trả về
    author.avatar = LINK_STATIC_URL + author.avatar; //thêm URL cho avatar 
    return author;
}

//create a new author
export async function create({name,avatar, email, phone, bio}) {
    const author = new Author({
        name,
        avatar,
        email,
        phone, 
        bio,
    });
    await author.save();
    return author;
}

//update an author
export async function update(authorId, {name, avatar, email, phone, bio}) {
    authorId.name = name;
    authorId.avatar = avatar;
    authorId.email = email;
    authorId.phone = phone;
    authorId.bio = bio;
    await authorId.save();
    return authorId;
}

//delete an author
export async function remove(authorId) {
    // Find all posts by the author
    const posts = await Post.find({author_id: authorId._id});

    // Delete all posts by the author
    for (const post of posts) {
        await Post.deleteOne({_id: post._id});

        // Remove the post id from the categories
        await Category.updateMany(
            {post_ids: post._id},
            {$pull: {post_ids: post._id}}
        );
    }

    await Author.deleteOne({_id: authorId._id}); 
} 

export async function blockToken(token) { 
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}