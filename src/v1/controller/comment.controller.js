'use strict';

const commentService = require('../services/comment.service');
const { CREATED, OK } = require('../core/success.response');

class CommentController {
    createComment = async (req, res, next) => {
        new CREATED({
            message: 'Create comment success !!!',
            metadata: await commentService.createComment({
                user_id: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };

    updateComment = async (req, res, next) => {
        new OK({
            message: 'Update comment success !!!',
            metadata: await commentService.updateCommentById(req.body),
        }).send(res);
    };

    deleteComment = async (req, res, next) => {
        new OK({
            message: 'Delete comment success !!!',
            metadata: await commentService.deleteCommentById(req.body),
        }).send(res);
    };

    getComment = async (req, res, next) => {
        new OK({
            message: 'Get comment success !!!',
            metadata: await commentService.getCommentByParentId(req.query),
        }).send(res);
    };
}

module.exports = new CommentController();
