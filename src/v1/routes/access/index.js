'use strict';

const express = require('express');
const accessController = require('../../controller/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUntils');
const router = express.Router();

router.post('/blog/signup', asyncHandler(accessController.signup));
router.post('/blog/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);
router.post('/blog/logout', asyncHandler(accessController.logout));
router.post(
    '/blog/handelRefreshToken',
    asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
