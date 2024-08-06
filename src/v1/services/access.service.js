'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
    createKeyToken,
    removeByUserId,
    findByRefreshTokenUsed,
    deleteKeyById,
    findByRefreshToken,
} = require('./keyToken.service');
const { createTokenPair, verifyToken } = require('../auth/authUntils');
const { getInfoData } = require('../untils');
const {
    BadRequestError,
    NotFoundError,
    AuthFailureError,
    ForbiddenError,
} = require('../core/error.response');
const keyTokenModel = require('../models/keyToken.model');
const { findUserByEmail } = require('./user.service');
const RoleBlog = {
    ADMIN: 'admin',
    AUTHOR: 'author',
    SUBSCRIBER: 'subscriber',
};

class AccessService {
    static handlerRefreshToken = async ({ refreshToken }) => {
        const foundToken = await findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const { userId, email } = await verifyToken(
                refreshToken,
                foundToken.publicKey
            );
            await deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened ! Pls relogin');
        }

        const holderToken = await findByRefreshToken(refreshToken);
        console.log(`holderToken::: ${holderToken}`);
        if (!holderToken) throw new AuthFailureError('Blog not registered');

        const { userId, email } = await verifyToken(
            refreshToken,
            holderToken.publicKey
        );

        const foundShop = await findUserByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Blog not registered!');

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1', //pkcs8
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });
        const tokens = await createTokenPair({
            payload: { userId, email },
            privateKey,
            publicKey,
        });

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });
        return {
            user: { userId, email },
            tokens,
        };
    };

    /*
        1. check email
        2. match password
        3. create AT & RT
        4. generate tokens
        5. get data return login
    */
    static login = async ({ email, password }) => {
        // 1.
        const foundUser = await userModel.findOne({ email });
        if (!foundUser) throw new NotFoundError('Blog not registered !');
        // 2.
        const match = bcrypt.compare(password, foundUser.password);
        if (!match) throw new AuthFailureError('Authentication error');
        // 3.
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1', //pkcs8
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });

        const tokens = await createTokenPair({
            payload: { userId: foundUser._id, name: foundUser.name, email },
            privateKey,
            publicKey,
        });

        console.log(`Created Token Success:::`, tokens);

        const publicKeyToken = await createKeyToken({
            userId: foundUser._id,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        if (!publicKeyToken) {
            throw new NotFoundError('publicKeyToken not found !');
        }

        return {
            status: 201,
            metadata: {
                blog: getInfoData({
                    fields: ['id', 'name', 'email'],
                    object: foundUser,
                }),
            },
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await removeByUserId(keyStore._id);
        console.log(`delKey ::: ${delKey}`);
        return delKey;
    };

    static signup = async ({ name, email, password }) => {
        try {
            // check email exists ???
            const holderBlog = await userModel.findOne({ email }).lean();
            if (holderBlog) {
                throw new BadRequestError('Blog already registered !');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await userModel.create({
                name,
                email,
                password: passwordHash,
                role: RoleBlog.AUTHOR,
            });

            if (newShop) {
                // created  privateKey, publicKey

                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    'rsa',
                    {
                        modulusLength: 2048,
                        publicKeyEncoding: {
                            type: 'pkcs1', //pkcs8
                            format: 'pem',
                        },
                        privateKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem',
                        },
                    }
                );

                const tokens = await createTokenPair({
                    payload: { name: newShop.name, email },
                    privateKey,
                    publicKey,
                });

                console.log(`Created Token Success:::`, tokens);

                const publicKeyToken = await createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    refreshToken: tokens.refreshToken,
                });

                if (!publicKeyToken) {
                    throw new NotFoundError('publicKeyToken not found !');
                }
            }

            return {
                status: 201,
                metadata: {
                    blog: getInfoData({
                        fields: ['id', 'name', 'email'],
                        object: newShop,
                    }),
                },
            };
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            };
        }
    };
}

module.exports = AccessService;
