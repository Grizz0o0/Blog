'use strict';

const express = require('express');
const accessController = require('../../controller/access.controller');
const router = express.Router();

router.post('/blog/signup', accessController.signup);

module.exports = router;
