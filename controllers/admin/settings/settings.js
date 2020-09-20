const { Op } = require("sequelize");
const Term = require('../../../model/term');
const { renderView, renderViewError } = require('../../../middleware/router');
const { getUniqueSlug } = require('../../../utils/string');

exports.all = async (req, res, next) => {
    try {
        const ps = await Term.findOne({
            where: { slug: 'product-specifications' },
            include: [{
                model: Term,
            }]
        });
        const terms = await Term.findAll({
            where: { parent_id: ps.id },
            include: [{
                model: Term,
            }]
        });

        renderView(req, res, {
            title: 'تنظیمات',
            data: terms
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.add = async (req, res, next) => {
    try {
        const product_specifications = await Term.findOne({
            where: { slug: 'product-specifications' },
            include: [{
                model: Term,
            }],
        });
        const data = await Term.findAll({
            where: { parent_id: product_specifications.id },
            include: [{
                model: Term
            }]
        });
        renderView(req, res, {
            title: 'تنظیمات مشخصات محصول',
            parents: data,
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'تنظیمات مشخصات محصول',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const body = req.body;
        if(!body.parent_id || body.parent_id.toString() === "0") body["parent_id"] = 2;
        body["slug"] = await getUniqueSlug(Term, body.title, body.slug);
        const data = await Term.create(body);
        renderView(req, res, {
            data,
            redirect: '/admin/settings/add'
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};

exports.destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Term.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/admin/settings/add'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};


exports.home = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Term.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/admin/settings/add'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
