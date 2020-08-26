const { validationResult } = require('express-validator/check');
const Tag = require('../../model/tag');
const { renderView, renderViewError } = require('../../middleware/router');
const { getUniqueSlug } = require('../../utils/string');

const all = async (req, res, next) => {
    try {
        const result = await Tag.findAll();
        renderView(req, res, {
            title: 'لیست تگ ها',
            tags: result
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        renderView(req, res, {
            title: 'افزودن تگ',
            editing: false,
            hasError: false,
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن تگ',
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const name = req.body.name;
        const slug = await getUniqueSlug(Tag, req.body.name, req.body.slug);
        const user_id = req.session.user.id;
        const body = {
            name,
            slug,
            user_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'افزودن تگ',
                status: 422,
                editing: false,
                hasError: true,
                tag: {
                    name,
                    slug
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const tag = await Tag.create(body);
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tag = await Tag.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش تگ',
            tag,
            editing: true,
            hasError: false,
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش تگ',
            errors: e
        });
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const slug = req.body.slug;
        const body = {
            name,
            slug
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'ویرایش تگ',
                status: 422,
                editing: true,
                hasError: true,
                tag: {
                    name,
                    slug
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const tag = await Tag.update(body,{
            where: { id }
        });
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tag = await Tag.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    all,
    add,
    save,
    edit,
    update,
    destroy
};
