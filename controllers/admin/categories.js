const { validationResult } = require('express-validator/check');
const Category = require('../../model/category');
const { renderView, renderViewError } = require('../../middleware/router');
const { getUniqueSlug } = require('../../utils/string');

const all = async (req, res, next) => {
    try {
        const data = await Category.findAll({
            include: [Category]
        });
        renderView(req, res, {
            title: 'لیست دسته بندی ها',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن دسته بندی',
            editing: false,
            hasError: false,
            categories
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن دسته بندی',
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const name = req.body.name;
        const slug = await getUniqueSlug(Category, req.body.name, req.body.slug);
        const parent_id = req.body.parent_id || null;
        const user_id = req.session.user.id;
        const body = {
            name,
            slug,
            parent_id,
            user_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const categories = await Category.findAll();
            return renderView(req, res, {
                title: 'افزودن دسته بندی',
                status: 422,
                editing: false,
                hasError: true,
                category: {
                    name,
                    slug,
                    parent_id
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                categories,
            });
        }
        const category = await Category.create(body);
        renderView(req, res, {
            category,
            redirect: '/admin/categories'
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
        const category = await Category.findByPk(id);
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'ویرایش دسته بندی',
            editing: true,
            hasError: false,
            category,
            categories
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش دسته بندی',
            errors: e
        });
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const slug = req.body.slug;
        const parent_id = req.body.parent_id || null;
        const body = {
            name,
            slug,
            parent_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const categories = await Category.findAll();
            return renderView(req, res, {
                title: 'ویرایش دسته بندی',
                status: 422,
                editing: true,
                hasError: true,
                category: {
                    name,
                    slug,
                    parent_id
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                categories,
            });
        }
        const category = await Category.update(body,{
            where: { id }
        });
        renderView(req, res, {
            category,
            redirect: '/admin/categories'
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
        const category = await Category.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            category,
            redirect: '/admin/categories'
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
