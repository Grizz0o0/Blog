'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// apiKey
router.use(apiKey);
// permission
router.use(permission('0000'));

router.use('/v1/api', require('./access'));
router.use('/v1/api/post', require('./post'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api/like', require('./like'));

module.exports = router;
