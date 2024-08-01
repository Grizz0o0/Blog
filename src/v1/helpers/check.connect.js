'use strict';

const mongoose = require('mongoose');

// count connected
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of collection: ${numConnection}`);
};

module.exports = {
    countConnect,
};
