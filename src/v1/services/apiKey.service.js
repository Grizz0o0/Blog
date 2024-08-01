'use strict';

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');

const findById = async (key) => {
    // const newApiKey = crypto.randomBytes(64).toString('hex');
    // const newApi = await apiKeyModel.create({
    //     key: newApiKey,
    //     permissions: ['0000'],
    // });
    // console.log(`API Key::: ${newApi.key}`);
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
};

module.exports = { findById };
