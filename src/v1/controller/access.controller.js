'use strict';

const accessService = require('../services/access.service');
const { SuccessResponse } = require('../core/success.response');

class AccessController {
    signup = async (req, res, next) => {
        new SuccessResponse({
            message: 'Sign up success !!!',
            metadata: await accessService.signup(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
