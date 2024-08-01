'use strict';

const userModel = require('../models/user.model');

const findUserByEmail = async ({
    email,
    select = { email: 1, name: 1, password: 1, role: 1 },
}) => {
    return await userModel.findOne({ email }).select(select).lean();
};

module.exports = { findUserByEmail };
