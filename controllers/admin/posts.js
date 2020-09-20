const { validationResult } = require('express-validator/check');
const Category = require('../../model/category');
const Tag = require('../../model/tag');
const Post = require('../../model/post');
const Media = require('../../model/media');
const { renderView, renderViewError } = require('../../middleware/router');
const { getUniqueSlug } = require('../../utils/string');

exports.all = async (req, res, next) => {
    try {
        const data = await Post.findAll({
            include: [Media]
        });
        renderView(req, res, {
            title: 'لیست پست ها',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.add = async (req, res, next) => {
    try {
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن پست',
            editing: false,
            hasError: false,
            tags,
            categories
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن پست',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Post, title, req.body.slug);
        const category_id = req.body.category_id;
        const tags = req.body.tags;
        const content = req.body.content;
        const media = req.body.media;
        const user_id = req.session.user.id;
        const body = {
            title,
            slug,
            category_id,
            tags,
            content,
            user_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'افزودن پست',
                status: 422,
                editing: false,
                hasError: true,
                post: {
                    title,
                    slug,
                    category_id,
                    tags,
                    content
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        const post_created = await Post.create(body);
        if(category_id && category_id !== 0) await post_created.setCategories(category_id);
        if(tags) await post_created.setTags(tags);
        const media_list = [];
        if(media && media.length > 0) {
            for(let m = 0 ; m < media.length ; m++) {
                media_list.push(media[m]);
            }
            await post_created.setMedia(media_list);
        }

        const post = await Post.findByPk(post_created.id, { include: [Media, Tag, Category]});

        renderView(req, res, {
            post,
            redirect: '/admin/posts'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id, {
            include: [Category, Tag, Media]
        });
        // return res.send(post);
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'ویرایش پست',
            post,
            tags,
            categories,
            editing: true,
            hasError: false,
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش پست',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const slug = req.body.slug;
        const category_id = req.body.category_id;
        const tags = req.body.tags;
        const content = req.body.content;
        const media = req.body.media;
        const body = {
            title,
            slug,
            category_id,
            tags,
            content
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'ویرایش پست',
                status: 422,
                editing: true,
                hasError: true,
                post: {
                    title,
                    slug,
                    category_id,
                    tags,
                    content
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const get_post = await Post.findByPk(id, {
            include: [Category, Tag]
        });
        await Post.update(body,{
            where: { id }
        });
        if(category_id && category_id !== 0) await get_post.setCategories(category_id);
        if(tags) await get_post.setTags(tags);
        const media_list = [];
        if(media && media.length > 0) {
            for(let m = 0 ; m < media.length ; m++) {
                media_list.push(media[m]);
            }
            await get_post.setMedia(media_list);
        }

        const post = await Post.findByPk(id, { include: [Media, Tag, Category]});
        renderView(req, res, {
            post,
            redirect: '/admin/posts'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            post,
            redirect: '/admin/posts'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
