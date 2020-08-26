const { validationResult } = require('express-validator/check');
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
            editing: false,
            hasError: false,
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
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const role_id = req.body.role_id;
        const body = {
            first_name,
            last_name,
            email,
            mobile,
            role_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const roles = await Role.findAll();
            return renderView(req, res, {
                user: body,
                editing: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                roles
            });
        }
        const user = await User.create(body);
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
            editing: true,
            hasError: false,
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
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const role_id = req.body.role_id;
        const body = {
            first_name,
            last_name,
            email,
            mobile,
            role_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const roles = await Role.findAll();
            return renderView(req, res, {
                user: body,
                editing: true,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                roles
            });
        }
        const user = await User.update(body,{
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
    destroy,
};
