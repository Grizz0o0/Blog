'use strict';

const accessService = require('../services/access.service');
const { CREATED, OK } = require('../core/success.response');

class AccessController {
    signup = async (req, res, next) => {
        new CREATED({
            message: 'Sign up success !!!',
            metadata: await accessService.signup(req.body),
        }).send(res);
    };

    login = async (req, res, next) => {
        new OK({
            message: 'Login success !!!',
            metadata: await accessService.login(req.body),
        }).send(res);
    };

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout success !!!',
            metadata: await accessService.logout(req.keyStore),
        }).send(res);
    };

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: 'handleRefreshToken success !!!',
            metadata: await accessService.handlerRefreshToken(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
