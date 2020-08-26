const Category = require('../../model/category');
const User = require('../../model/user');
const { renderView, renderViewError } = require('../../middleware/router');

const all = async (req, res, next) => {
    try {
        const result = await Category.findAll({
            include: [Category]
        });
        renderView(req, res, {
            title: 'لیست دسته بندی ها',
            categories: result
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن دسته بندی',
            users,
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
        if(!req.body.parent_id || req.body.parent_id === 0) delete req.body.parent_id;
        const category = await Category.create(req.body);
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
        const users = await User.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'ویرایش دسته بندی',
            category,
            users,
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
        const category = await Category.update(req.body,{
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
