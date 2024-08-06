'use strict';
const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                refreshTokenUsed: [],
                refreshToken,
            };
            const option = { upsert: true, new: true };

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                option
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        const keyStore = await keyTokenModel.findOne({ user: userId });
        return keyStore;
    };

    static removeByUserId = async (id) => {
        const user = await keyTokenModel.findByIdAndDelete(id);
        return user;
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken });
    };

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({ user: userId });
    };
}

module.exports = KeyTokenService;
