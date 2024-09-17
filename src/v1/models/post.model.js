const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Post';
const COLLECTION_NAME = 'Posts';

const postSchema = new Schema(
    {
        post_title: { type: String, required: true },
        post_slug: { type: String, unique: true },
        post_content: { type: String, required: true },
        post_author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post_category: {
            type: String,
            enum: [
                'Technology',
                'Development',
                'Business',
                'Lifestyle',
                'Education',
                'Entertainment',
                'Hobbies',
                'News',
                'Reviews',
            ],
            required: true,
        },
        post_likesCount: { type: Number, default: 0 },
        post_tags: { type: [String], default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Create index for search
postSchema.index({ post_title: 'text', post_content: 'text' });

// Document middleware: run before .save() and .create()
postSchema.pre('save', function (next) {
    this.post_slug = slugify(this.post_title, { lower: true });
    next();
});

const technologySchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Technology',
    }
);

const educationSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Education',
    }
);

const entertainmentSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Entertainment',
    }
);

const hobbiesSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Hobbies',
    }
);

const lifestyleSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Lifestyle',
    }
);

const newsSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'News',
    }
);

const reviewsSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Reviews',
    }
);

const businessSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: [String], default: [] },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
        collection: 'Business',
    }
);

technologySchema.index({ title: 'text' });
educationSchema.index({ title: 'text' });
entertainmentSchema.index({ title: 'text' });
hobbiesSchema.index({ title: 'text' });
lifestyleSchema.index({ title: 'text' });
newsSchema.index({ title: 'text' });
reviewsSchema.index({ title: 'text' });
businessSchema.index({ title: 'text' });

module.exports = {
    post: model(DOCUMENT_NAME, postSchema),
    technology: model('Technology', technologySchema),
    education: model('Education', educationSchema),
    entertainment: model('Entertainment', entertainmentSchema),
    hobbies: model('Hobbies', hobbiesSchema),
    lifestyle: model('Lifestyle', lifestyleSchema),
    news: model('News', newsSchema),
    reviews: model('Reviews', reviewsSchema),
    business: model('Business', businessSchema),
};
