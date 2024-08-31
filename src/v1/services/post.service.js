'use strict';

const {
    post,
    technology,
    education,
    entertainment,
    hobbies,
    business,
    lifestyle,
    news,
    reviews,
} = require('../models/post.model');
const { BadRequestError } = require('../core/error.response');
const {
    publishPostByUser,
    unPublishPostByUser,
    deletePostByUser,
    findAllDraftsForUser,
    searchPostByUser,
    findAllPublishForUser,
    findAllPosts,
    findPost,
    updatePostByUser,
} = require('../models/repositories/post.repo');
const { removeUndefinedObject } = require('../untils/index');

class PostFactory {
    static postRegistry = {};

    static registerPostCategory(type, classRef) {
        PostFactory.postRegistry[type] = classRef;
    }

    static async createPost(type, payload) {
        const productClass = PostFactory.postRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Post Types::: ${type}`);

        return new productClass(payload).createPost();
    }

    static async updatePost(type, post_id, payload) {
        const productClass = PostFactory.postRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Post Types::: ${type}`);

        return new productClass(payload).updatePost(post_id);
    }

    static async publishPostByUser({ post_id, post_author }) {
        return await publishPostByUser({ post_id, post_author });
    }

    static async unPublishPostByUser({ post_id, post_author }) {
        return await unPublishPostByUser({ post_id, post_author });
    }

    static async deletePostByUser({ post_id, post_author }) {
        return await deletePostByUser({ post_id, post_author });
    }
    // query

    static async findAllDraftsForUser({ post_author, limit = 50, skip = 0 }) {
        const query = { post_author, isDraft: true };
        return await findAllDraftsForUser({ query, limit, skip });
    }

    static async findAllPublishForUser({ post_author, limit = 50, skip = 0 }) {
        const query = { post_author, isPublished: true };
        return await findAllPublishForUser({ query, limit, skip });
    }

    static async findAllPosts({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true },
        select = ['post_title', 'post_author', 'post_category'],
    }) {
        return await findAllPosts({ limit, sort, page, filter, select });
    }

    static async findPost({ post_id, unselect = ['__v'] }) {
        return await findPost({ post_id, unselect });
    }

    static async searchPosts({ keySearch = '' }) {
        return await searchPostByUser({ keySearch });
    }
}

class Post {
    constructor({
        post_title,
        post_content,
        post_author,
        post_category,
        post_tags,
    }) {
        this.post_title = post_title;
        this.post_content = post_content;
        this.post_author = post_author;
        this.post_category = post_category;
        this.post_tags = post_tags;
    }

    async createPost(post_id) {
        const newPost = await post.create({ ...this, _id: post_id });
        return newPost;
    }

    async updatePost(post_id, payload) {
        return await updatePostByUser({
            post_id,
            payload,
            model: post,
        });
    }
}

class TechnologyPost extends Post {
    async createPost() {
        const newTechnology = await technology.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newTechnology}`);

        if (!newTechnology)
            throw new BadRequestError('Create new TechnologyPost error');

        const newPost = await super.createPost(newTechnology._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: technology,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class EducationPost extends Post {
    async createPost() {
        const newEducation = await education.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newEducation}`);

        if (!newEducation)
            throw new BadRequestError('Create new EducationPost error');

        const newPost = await super.createPost(newEducation._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: education,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class EntertainmentPost extends Post {
    async createPost() {
        const newEntertainment = await entertainment.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newEntertainment}`);

        if (!newEntertainment)
            throw new BadRequestError('Create new EntertainmentPost error');

        const newPost = await super.createPost(newEntertainment._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: entertainment,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class HobbiesPost extends Post {
    async createPost() {
        const newHobbies = await hobbies.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newHobbies}`);

        if (!newHobbies)
            throw new BadRequestError('Create new HobbiesPost error');

        const newPost = await super.createPost(newHobbies._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: hobbies,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class LifestylePost extends Post {
    async createPost() {
        const newLifestyle = await lifestyle.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newLifestyle}`);

        if (!newLifestyle)
            throw new BadRequestError('Create new LifestylePost error');

        const newPost = await super.createPost(newLifestyle._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: lifestyle,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class BusinessPost extends Post {
    async createPost() {
        const newBusiness = await business.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newBusiness}`);

        if (!newBusiness)
            throw new BadRequestError('Create new BusinessPost error');

        const newPost = await super.createPost(newBusiness._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: business,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class NewsPost extends Post {
    async createPost() {
        const newNews = await news.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newNews}`);

        if (!newNews) throw new BadRequestError('Create new NewsPost error');

        const newPost = await super.createPost(newNews._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: news,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

class ReviewsPost extends Post {
    async createPost() {
        const newReviews = await reviews.create({
            title: this.post_title,
            author: this.post_author,
            tags: this.post_tags,
        });
        console.log(`New::: ${newReviews}`);

        if (!newReviews)
            throw new BadRequestError('Create new ReviewsPost error');

        const newPost = await super.createPost(newReviews._id);
        if (!newPost) throw new BadRequestError('Create new Post error');
    }

    async updatePost(post_id) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.tags) {
            await updatePostByUser({
                post_id,
                payload,
                model: reviews,
            });
        }
        const updatePost = await super.updatePost(post_id, objectParams);
        return updatePost;
    }
}

PostFactory.registerPostCategory('Technology', TechnologyPost);
PostFactory.registerPostCategory('Education', EducationPost);
PostFactory.registerPostCategory('Entertainment', EntertainmentPost);
PostFactory.registerPostCategory('Hobbies', HobbiesPost);
PostFactory.registerPostCategory('Business', BusinessPost);
PostFactory.registerPostCategory('Lifestyle', LifestylePost);
PostFactory.registerPostCategory('News', NewsPost);
PostFactory.registerPostCategory('Reviews', ReviewsPost);

module.exports = PostFactory;
