const _ = require('lodash');
const { validationResult } = require('express-validator/check');
const Permission = require('../../model/permission');
const Role = require('../../model/role');
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
        const data = await Role.findAll({
            include: [Permission]
        });
        renderView(req, res, {
            title: 'لیست نقش ها',
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
        const permissions = await getPermission();
        renderView(req, res, {
            title: 'افزودن نقش',
            editing: false,
            hasError: false,
            permissions
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن نقش',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const slug = await getUniqueSlug(Role, title, req.body.slug);
        const user_id = req.session.user.id;
        const permissions_id = req.body.permissions;
        const body = {
            title,
            slug,
            user_id,
            description
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const permissions = await getPermission();
            return renderView(req, res, {
                title: 'افزودن نقش',
                status: 422,
                editing: false,
                hasError: true,
                role: {
                    title,
                    description
                },
                permissions,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const role = await Role.create(body);
        await role.setPermissions(permissions_id);
        renderView(req, res, {
            role,
            redirect: '/admin/roles'
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
        const role_data = await Role.findByPk(id, {
            include: [Permission]
        });
        const role_permissions = _.map(role_data.permissions, p => p.id);
        const permissions = await getPermission();
        const role = {
            id: role_data.id,
            title: role_data.title,
            slug: role_data.slug,
            description: role_data.description,
            permissions: role_permissions
        };
        renderView(req, res, {
            title: 'ویرایش نقش',
            role,
            permissions,
            editing: true,
            hasError: false,
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش نقش',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const slug = req.body.slug;
        const description = req.body.description;
        const permissions_id = req.body.permissions;
        const body = {
            title,
            slug,
            description
        };
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return renderView(req, res, {
                title: 'ویرایش نقش',
                status: 422,
                editing: true,
                hasError: true,
                role: {
                    title,
                    slug,
                    description
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        await Role.update(body,{
            where: { id }
        });
        const role = await Role.findByPk(id);
        await role.setPermissions(permissions_id);
        renderView(req, res, {
            role,
            redirect: '/admin/roles'
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
        const role = await Role.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            role,
            redirect: '/admin/roles'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
