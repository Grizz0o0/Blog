'use strict';

const express = require('express');
const postController = require('../../controller/post.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUntils');
const router = express.Router();

router.get('', asyncHandler(postController.findAllPosts));
router.get('/:id', asyncHandler(postController.findPost));
router.get('/search/:keySearch', asyncHandler(postController.searchPosts));

// authentication
router.use(authentication);
router.post('', asyncHandler(postController.createPost));
router.patch('/:id', asyncHandler(postController.updatePost));
router.post('/publish/:id', asyncHandler(postController.publishPostByUser));
router.post('/unpublish/:id', asyncHandler(postController.unPublishPostByUser));
router.post('/delete/:id', asyncHandler(postController.deletePostByUser));
router.get('/drafts/all', asyncHandler(postController.findDraftsPostByUser));
router.get('/publish/all', asyncHandler(postController.findPublishPostByUser));

module.exports = router;
