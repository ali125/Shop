const Term = require('../../model/term');
const Term_Meta = require('../../model/termmeta');
const { renderView, renderViewError } = require('../../middleware/router');

const all = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const parent_data = await Term.findOne({
            where: { slug },
            include: [Term]
        });
        let sub_data = [];
        const data = await Term_Meta.findAll({
            include: [{
                model: Term,
                where: { slug }
            }]
        });
        if(parent_data.terms.length > 0) {
            for(let i = 0 ; i < parent_data.terms.length ; i++) {
                const term_slug = parent_data.terms[i].slug;
                const meta_data = await Term_Meta.findAll({
                    include: [{
                        model: Term,
                        where: { slug: term_slug }
                    }]
                });
                sub_data = [...sub_data, ...meta_data];
            }
        }
        const title = parent_data.title;
        renderView(req, res, {
            title,
            data,
            sub_data,
            parent_data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const body = req.body;
        const term = await Term.findOne({
            where: { slug }
        });
        if(body.parent_id) {
            body['term_id'] = body.parent_id;
            delete body.parent_id;
        } else {
            body['term_id'] = term.id
        }
        const data = await Term_Meta.create(body);
        renderView(req, res, {
            data,
            redirect: '/admin/settings/product/' + slug
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const destroy = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const id = req.params.id;
        const data = await Term_Meta.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/admin/settings/product/' + slug
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    all,
    save,
    destroy
};
