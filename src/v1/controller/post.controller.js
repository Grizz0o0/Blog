'use strict';

const postService = require('../services/post.service');
const { CREATED, OK } = require('../core/success.response');

class PostController {
    createPost = async (req, res, next) => {
        new CREATED({
            message: 'Create post success !!!',
            metadata: await postService.createPost(req.body.post_category, {
                ...req.body,
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    updatePost = async (req, res, next) => {
        new CREATED({
            message: 'Update post success !!!',
            metadata: await postService.updatePost(
                req.body.post_category,
                req.params.id,
                {
                    post_author: req.user.userId,
                    ...req.body,
                }
            ),
        }).send(res);
    };

    publishPostByUser = async (req, res, next) => {
        new OK({
            message: 'Publish post by user success !!!',
            metadata: await postService.publishPostByUser({
                post_id: req.params.id,
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    unPublishPostByUser = async (req, res, next) => {
        new OK({
            message: 'UnPublish post by user success !!!',
            metadata: await postService.unPublishPostByUser({
                post_id: req.params.id,
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    deletePostByUser = async (req, res, next) => {
        new OK({
            message: 'Delete post by user success !!!',
            metadata: await postService.deletePostByUser({
                post_id: req.params.id,
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    findDraftsPostByUser = async (req, res, next) => {
        new OK({
            message: 'Find Drafts post by user success !!!',
            metadata: await postService.findAllDraftsForUser({
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    findPublishPostByUser = async (req, res, next) => {
        new OK({
            message: 'Find Publish post by user success !!!',
            metadata: await postService.findAllPublishForUser({
                post_author: req.user.userId,
            }),
        }).send(res);
    };

    findAllPosts = async (req, res, next) => {
        new OK({
            message: 'Find all posts success !!!',
            metadata: await postService.findAllPosts(req.query),
        }).send(res);
    };

    findPost = async (req, res, next) => {
        new OK({
            message: 'Find post success !!!',
            metadata: await postService.findPost({ post_id: req.params.id }),
        }).send(res);
    };

    searchPosts = async (req, res, next) => {
        new OK({
            message: 'Search post success !!!',
            metadata: await postService.searchPosts(req.params),
        }).send(res);
    };
}

module.exports = new PostController();
