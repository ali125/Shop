const { validationResult } = require('express-validator/check');
const Address = require('../../model/address');
const Location = require('../../model/location');
const User = require('../../model/user');
const Role = require('../../model/role');
const { renderView, renderViewError } = require('../../middleware/router');

exports.all = async (req, res, next) => {
    try {
        const result = await User.findAll({
            include: Role
        });
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
exports.add = async (req, res, next) => {
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
exports.save = async (req, res, next) => {
    try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = req.body.password;
        const role_id = req.body.role_id;
        const body = {
            first_name,
            last_name,
            email,
            mobile,
            role_id,
            password
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
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.edit = async (req, res, next) => {
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
exports.update = async (req, res, next) => {
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
exports.destroy = async (req, res, next) => {
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

exports.profile = async (req, res, next) => {
    try {
        const getUser = req.session.user;
        const user = await User.findOne({
            where: {id: getUser.id},
            include: [Role],
        });
        const addresses = await Address.findAll({
            where: { user_id: getUser.id },
            include: [
                {
                    model: Location,
                    as: 'state'
                },
                {
                    model: Location,
                    as: 'city'
                }
            ]
        });
        // return res.send(addresses);
        renderView(req, res, {
            title: 'حساب کاربری',
            user,
            addresses
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'تنظیمات مشخصات محصول',
            errors: e
        });
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const getUser = req.session.user;
        // const errors = validationResult(req);
        // if(!errors.isEmpty()) {
        //     return renderView(req, res, {
        //         user: req.body,
        //         editing: true,
        //         hasError: true,
        //         errorMessage: errors.array()[0].msg,
        //         validationErrors: errors.array()
        //     });
        // }
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const mobile = req.body.mobile;
        const email = req.body.email;
        const body = {
            first_name,
            last_name,
            email,
            mobile
        };
        if(req.file) body['avatar_url'] = req.file.path;

        await User.update(body, {
            where: {id: getUser.id}
        });
        const user = await User.findOne({
            where: {id: getUser.id},
            include: [Role],
        });
        req.session.user = user;
        renderView(req, res, {
            title: 'ویرایش حساب کاربری',
            user
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'تنظیمات مشخصات محصول',
            errors: e
        });
    }
};
