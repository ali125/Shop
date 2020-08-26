const User = require('../../model/user');
const Role = require('../../model/role');
const { renderView, renderViewError } = require('../../middleware/router');

const all = async (req, res, next) => {
    try {
        const result = await User.findAll();
        renderView(req, res, {
            title: 'لیست کاربران',
            users: result
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        const roles = await Role.findAll();
        renderView(req, res, {
            title: 'افزودن کاربر',
            roles
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن کاربر',
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        renderView(req, res, {
            user,
            redirect: '/admin/users'
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
        const roles = await Role.findAll();
        const user = await User.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش کاربر',
            roles,
            user
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش کاربر',
            errors: e
        });
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.update(req.body,{
            where: { id }
        });
        renderView(req, res, {
            user,
            redirect: '/admin/users'
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
        const user = await User.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            user,
            redirect: '/admin/users'
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
