const { validationResult } = require('express-validator/check');
const Location = require('../../model/location');
const Address = require('../../model/address');
const User = require('../../model/user');
const { renderView, renderViewError } = require('../../middleware/router');

exports.all = async (req, res, next) => {
    try {
        const getUser = req.session.user;
        const addresses = await Address.findAll({
            where: { user_id: getUser.id },
            include: [
                User,
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
        renderView(req, res, {
            title: 'لیست آدرس ها',
            data: addresses
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'لیست آدرس ها',
            errors: e
        });
    }
};
exports.add = async (req, res, next) => {
    try {
        renderView(req, res, {
            title: 'افزودن آدرس',
            editing: false,
            hasError: false
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن آدرس',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const state_id = req.body.state_id;
        const city_id = req.body.city_id;
        const address = req.body.address;
        const phone = req.body.phone;
        const mobile = req.body.mobile;
        const user_id = req.session.user.id;
        const body = {
            title,
            state_id,
            city_id,
            address,
            phone,
            mobile,
            user_id
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'افزودن آدرس',
                data: body,
                editing: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }
        const data = await Address.create(body);
        renderView(req, res, {
            data,
            redirect: 'admin/addresses'
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
        const data = await Address.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش آدرس',
            editing: true,
            hasError: false,
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش آدرس',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const state_id = req.body.state_id;
        const city_id = req.body.city_id;
        const address = req.body.address;
        const phone = req.body.phone;
        const mobile = req.body.mobile;
        const body = {
            title,
            state_id,
            address,
            city_id,
            phone,
            mobile
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                data: body,
                editing: true,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }
        const data = await Address.update(body,{
            where: { id }
        });
        renderView(req, res, {
            data,
            redirect: '/admin/addresses'
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
        const address = await Address.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            address,
            redirect: '/admin/addresses'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

