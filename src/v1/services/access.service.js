'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUntils');
const { getInfoData } = require('../untils');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const RoleBlog = {
    ADMIN: 'admin',
    AUTHOR: 'author',
    SUBSCRIBER: 'subscriber',
};

class AccessService {
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

                const publicKeyToken = await createKeyToken({
                    userId: newShop._id,
                    publicKey,
                });

                if (!publicKeyToken) {
                    throw new NotFoundError('publicKeyToken not found !');
                }

                const tokens = await createTokenPair({
                    payload: { name: newShop.name, email },
                    privateKey,
                    publicKey,
                });

                console.log(`Created Token Success:::`, tokens);
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
