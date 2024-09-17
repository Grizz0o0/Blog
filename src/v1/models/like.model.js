'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Like';
const COLLECTION_NAME = 'Likes';

// Declare the Schema of the Mongo model
var likeSchema = new Schema(
    {
        like_postId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
        like_users: {
            type: [Schema.Types.ObjectId],
            required: true,
            default: [],
            ref: 'User',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, likeSchema);
