const Term = require('../../../model/term');
const { renderView, renderViewError } = require('../../../middleware/router');

const all = async (req, res, next) => {
    try {
        const data = await Term.findAll({
            where: { slug: 'product-specifications' }
        });
        renderView(req, res, {
            title: 'لیست مشخصات محصول',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const data = await Term.findOne({
            where: { slug: 'product-specifications' }
        });
        renderView(req, res, {
            data,
            redirect: '/admin/settings'
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
        const data = await Term.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/admin/settings'
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
