const likeModel = require('../models/like.model');
const { post } = require('../models/post.model');
const { convertToObjectIdMongodb } = require('../untils/index');
const { NotFoundError, BadRequestError } = require('../core/error.response');

class likeService {
    static async likePost({ post_id, user_id }) {
        const foundPost = await post.findById(
            convertToObjectIdMongodb(post_id)
        );
        if (!foundPost) throw new NotFoundError('Post not found !!!');

        const existingLike = await likeModel.findOne({
            like_postId: convertToObjectIdMongodb(post_id),
            like_users: convertToObjectIdMongodb(user_id),
        });
        if (existingLike)
            throw new BadRequestError('User has already liked this post');

        const like = await likeModel.findOneAndUpdate(
            { like_postId: convertToObjectIdMongodb(post_id) },
            { $addToSet: { like_users: convertToObjectIdMongodb(user_id) } },
            { new: true, upsert: true }
        );

        await post.findByIdAndUpdate(post_id, {
            $inc: { post_likesCount: 1 },
        });

        return like;
    }

    static async unLikePost({ post_id, user_id }) {
        console.log(123);
        const foundPost = await post.findById(
            convertToObjectIdMongodb(post_id)
        );
        if (!foundPost) throw new NotFoundError('Post not found !!!');

        const existingLike = await likeModel.findOne({
            like_postId: convertToObjectIdMongodb(post_id),
            like_users: convertToObjectIdMongodb(user_id),
        });
        if (!existingLike)
            throw new BadRequestError('User has not liked this post yet');

        const like = await likeModel.findOneAndUpdate(
            { like_postId: convertToObjectIdMongodb(post_id) },
            { $pull: { like_users: convertToObjectIdMongodb(user_id) } },
            { new: true }
        );

        await post.findByIdAndUpdate(post_id, {
            $inc: { post_likesCount: -1 },
        });

        return like;
    }
}

module.exports = likeService;
