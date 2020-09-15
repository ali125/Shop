const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const Permission = require('../../model/permission');
const { renderView, renderViewError } = require('../../middleware/router');
const { getUniqueSlug } = require('../../utils/string');

const getPermission = async () => {
    const permissions_data = await Permission.findAll({
        order: ['section_title']
    });
    const objs = {};
    _.map(permissions_data, ({ id, title, slug, section_title }) => {
        let obj = objs[section_title];
        if(typeof obj === "undefined") obj = { title: section_title, data: [] };
        obj.data.push({ id, title, slug });
        objs[section_title] = obj;
    });
    const permissions = _.map(objs, ({ title, data }) => ({ title , data }));
    return permissions;
};

exports.all = async (req, res, next) => {
    try {
        const data = await Permission.findAll({
            order: ["route_url"]
        });
        renderView(req, res, {
            title: 'لیست دسترسی ها',
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
        renderView(req, res, {
            title: 'افزودن دسترسی',
            editing: false,
            hasError: false
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن دسترسی',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const section_title = req.body.section_title;
        const route_url = req.body.route_url;
        const description = req.body.description;
        const slug = await getUniqueSlug(Permission, title, req.body.slug);
        const user_id = req.session.user.id;
        const body = {
            title,
            slug,
            section_title,
            route_url,
            user_id,
            description
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'افزودن دسترسی',
                status: 422,
                editing: false,
                hasError: true,
                permission: body,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const permission = await Permission.create(body);
        renderView(req, res, {
            permission,
            redirect: '/admin/permissions'
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
        const permission = await Permission.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش دسترسی',
            permission,
            editing: true,
            hasError: false,
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش دسترسی',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const section_title = req.body.section_title;
        const route_url = req.body.route_url;
        const description = req.body.description;
        const slug = req.body.slug;
        const body = {
            title,
            section_title,
            route_url,
            slug,
            description
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'ویرایش دسترسی',
                status: 422,
                editing: true,
                hasError: true,
                permission: body,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        await Permission.update(body,{
            where: { id }
        });
        const permission = await Permission.findByPk(id);
        renderView(req, res, {
            permission,
            redirect: '/admin/permissions'
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
        const permission = await Permission.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            permission,
            redirect: '/admin/permissions'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
