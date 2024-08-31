'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const {
    AuthFailureError,
    NotFoundError,
    BadRequestError,
} = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const createTokenPair = async ({ payload, privateKey, publicKey }) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`decode verify:::`, err);
            } else {
                console.log(`decode verify:::`, decode);
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error(error);
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1. Check userId 
        2. get accessToken
        3. verifyToken
        4. check userId in db ? 
        5. check keyStore with this userId ?
        6. get all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid request !');

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Invalid request !');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request !');

    try {
        const decode = JWT.verify(accessToken, keyStore.publicKey);
        console.log(decode);
        if (userId !== decode.userId)
            throw new AuthFailureError('Invalid userId !');
        req.keyStore = keyStore;
        req.user = decode;
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyToken = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyToken };
