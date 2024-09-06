'use strict';

const express = require('express');
const commentController = require('../../controller/comment.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUntils');
const router = express.Router();

router.get('', asyncHandler(commentController.getComment));
// authentication
router.use(authentication);
router.post('', asyncHandler(commentController.createComment));
router.patch('', asyncHandler(commentController.updateComment));
router.delete('', asyncHandler(commentController.deleteComment));

module.exports = router;
