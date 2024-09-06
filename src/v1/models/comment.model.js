'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
    {
        comment_postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        comment_userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment_content: { type: String, default: '', required: true },
        comment_left: { type: Number, default: 0 },
        comment_right: { type: Number, default: 0 },
        comment_parent: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema);
