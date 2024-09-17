'use strict';

const likeService = require('../services/like.service');
const { CREATED, OK } = require('../core/success.response');

class LikeController {
    likePost = async (req, res, next) => {
        new CREATED({
            message: 'Like success !!!',
            metadata: await likeService.likePost({
                user_id: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };

    unLikePost = async (req, res, next) => {
        new CREATED({
            message: 'UnLike success !!!',
            metadata: await likeService.unLikePost({
                user_id: req.user.userId,
                ...req.body,
            }),
        }).send(res);
    };
}

module.exports = new LikeController();
