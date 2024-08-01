'use strict';
const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                refreshTokenUsed: [],
                refreshToken: '',
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
}

module.exports = KeyTokenService;
