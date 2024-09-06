'use strict';

const commentModel = require('../models/comment.model');
const { NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongodb, getSelectData } = require('../untils');
const { findPost } = require('../models/repositories/post.repo');

class CommentService {
    static async createComment({
        post_id,
        user_id,
        content,
        parent_commentId,
    }) {
        const comment = new commentModel({
            comment_postId: post_id,
            comment_userId: user_id,
            comment_content: content,
            comment_parent: parent_commentId,
        });

        let rightValue;
        if (parent_commentId) {
            const parentComment = await commentModel.findById(parent_commentId);
            if (!parentComment)
                throw new NotFoundError('Not Found parentComment');
            rightValue = parentComment.comment_right;

            await commentModel.updateMany(
                {
                    comment_postId: convertToObjectIdMongodb(post_id),
                    comment_right: { $gte: rightValue },
                },
                { $inc: { comment_right: 2 } }
            );

            await commentModel.updateMany(
                {
                    comment_postId: convertToObjectIdMongodb(post_id),
                    comment_left: { $gt: rightValue },
                },
                { $inc: { comment_left: 2 } }
            );
        } else {
            const maxRightValue = await commentModel.findOne(
                {
                    comment_postId: convertToObjectIdMongodb(post_id),
                },
                'comment_right',
                { sort: { comment_right: -1 } }
            );
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;
        await comment.save();
        return comment;
    }

    static async getCommentByParentId({
        post_id,
        comment_parentId = null,
        limit,
        offset,
    }) {
        if (comment_parentId) {
            const parentComment = await commentModel.findById(comment_parentId);
            if (!parentComment)
                throw new NotFoundError('Not found comment parent');

            const comment = await commentModel
                .find({
                    comment_postId: convertToObjectIdMongodb(post_id),
                    comment_left: { $gt: parentComment.comment_left },
                    comment_right: { $lte: parentComment.comment_right },
                })
                .select(
                    getSelectData([
                        'comment_left',
                        'comment_right',
                        'comment_content',
                        'comment_parent',
                    ])
                )
                .sort({
                    comment_left: 1,
                });

            return comment;
        }

        const comment = await commentModel
            .find({
                comment_postId: convertToObjectIdMongodb(post_id),
                comment_parent: comment_parentId,
            })
            .select(
                getSelectData([
                    'comment_left',
                    'comment_right',
                    'comment_content',
                    'comment_parent',
                ])
            )
            .sort({
                comment_left: 1,
            });

        return comment;
    }

    static async deleteCommentById({ post_id, comment_id }) {
        const post = await findPost({ post_id });
        if (!post) throw new NotFoundError('Not found post');

        const comment = await commentModel.findById(comment_id);
        if (!comment) throw new NotFoundError('Not found comment');

        const rightValue = comment.comment_right;
        const leftValue = comment.comment_left;

        const width = rightValue - leftValue + 1;

        // xóa các comment con
        await commentModel.deleteMany({
            comment_postId: convertToObjectIdMongodb(post_id),
            comment_left: { $gte: leftValue, $lte: rightValue },
        });

        // cap nhat comment
        await commentModel.updateMany(
            {
                comment_postId: convertToObjectIdMongodb(post_id),
                comment_right: { $gt: rightValue },
            },
            {
                $inc: { comment_right: -width },
            }
        );

        await commentModel.updateMany(
            {
                comment_postId: convertToObjectIdMongodb(post_id),
                comment_left: { $gt: rightValue },
            },
            {
                $inc: { comment_left: -width },
            }
        );

        return comment;
    }

    static async updateCommentById({ post_id, comment_id, comment_content }) {
        const post = await findPost({ post_id });
        if (!post) throw new NotFoundError('Not found post');

        const comment = await commentModel.findById(comment_id);
        console.log(`Comment::: ${comment}`);
        console.log(`comment_content::: ${comment_content}`);

        if (!comment) throw new NotFoundError('Not found comment');

        return await commentModel.findByIdAndUpdate(
            convertToObjectIdMongodb(comment_id),
            { comment_content },
            { new: true }
        );
    }
}

module.exports = CommentService;
