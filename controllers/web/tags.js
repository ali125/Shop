const Tag = require('../../model/tag');
const { renderView, renderViewError } = require('../../middleware/router');

const all = async (req, res, next) => {
    try {
        const result = await Tag.findAll();
        renderView(req, res, {
            title: 'لیست تگ ها',
            tags: result
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        renderView(req, res, {
            title: 'افزودن تگ'
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن تگ',
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const tag = await Tag.create(req.body);
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
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
        const tag = await Tag.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش تگ',
            tag
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش تگ',
            errors: e
        });
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tag = await Tag.update(req.body,{
            where: { id }
        });
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
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
        const tag = await Tag.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            tag,
            redirect: '/admin/tags'
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
