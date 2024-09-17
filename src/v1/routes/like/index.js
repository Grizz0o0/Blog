'use strict';

const express = require('express');
const likeController = require('../../controller/like.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUntils');
const router = express.Router();

// authentication
router.use(authentication);
router.post('', asyncHandler(likeController.likePost));
router.delete('', asyncHandler(likeController.unLikePost));

module.exports = router;
