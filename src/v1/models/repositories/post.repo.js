'use strict';

const {
    post,
    education,
    entertainment,
    hobbies,
    technology,
} = require('../../models/post.model');

const { Types } = require('mongoose');
const { unGetSelectData, getSelectData } = require('../../untils');

const updatePostByUser = async ({ post_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(post_id, payload, {
        new: isNew,
    });
};

const searchPostByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await post
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch },
            },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean();

    return results;
};

const findAllDraftsForUser = async ({ query, limit, skip }) => {
    const foundPost = await queryPost({ query, limit, skip });
    return foundPost;
};

const findAllPublishForUser = async ({ query, limit, skip }) => {
    const foundPost = await queryPost({ query, limit, skip });
    return foundPost;
};

const findAllPosts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const posts = await post
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return posts;
};

const findPost = async ({ post_id, unselect }) => {
    return await post
        .findById(post_id)
        .select(unGetSelectData(unselect))
        .lean();
};

const publishPostByUser = async ({ post_id, post_author }) => {
    const foundPost = await post.findOne({
        _id: new Types.ObjectId(post_id),
        post_author: new Types.ObjectId(post_author),
    });

    if (!foundPost) return null;
    foundPost.isPublished = true;
    foundPost.isDraft = false;
    foundPost.isDeleted = false;

    const { modifiedCount } = await foundPost.updateOne(foundPost);
    console.log(`modifiedCount ::: ${modifiedCount}`);
    return modifiedCount;
};

const unPublishPostByUser = async ({ post_id, post_author }) => {
    const foundPost = await post.findOne({
        _id: new Types.ObjectId(post_id),
        post_author: new Types.ObjectId(post_author),
    });

    if (!foundPost) return null;
    foundPost.isDraft = true;
    foundPost.isDeleted = false;
    foundPost.isPublished = false;

    const { modifiedCount } = await foundPost.updateOne(foundPost);
    console.log(`modifiedCount ::: ${modifiedCount}`);
    return modifiedCount;
};

const deletePostByUser = async ({ post_id, post_author }) => {
    const foundPost = await post.findOne({
        _id: new Types.ObjectId(post_id),
        post_author: new Types.ObjectId(post_author),
    });

    if (!foundPost) return null;
    foundPost.isDeleted = true;
    foundPost.isDraft = false;
    foundPost.isPublished = false;

    const { modifiedCount } = await foundPost.updateOne(foundPost);
    console.log(`modifiedCount ::: ${modifiedCount}`);
    return modifiedCount;
};

const queryPost = async ({ query, limit, skip }) => {
    const results = await post
        .find(query)
        .populate('post_author', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    return results;
};

module.exports = {
    updatePostByUser,
    publishPostByUser,
    unPublishPostByUser,
    deletePostByUser,
    findAllDraftsForUser,
    searchPostByUser,
    findAllPosts,
    findAllPublishForUser,
    findPost,
};
