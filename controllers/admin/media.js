const Media = require('../../model/media');
const Product = require('../../model/product');
const { renderView, renderViewError } = require('../../middleware/router');

exports.all = async (req, res, next) => {
    try {
        const result = await Media.findAll({
            include: [Product]
        });
        renderView(req, res, {
            title: 'لیست عکس ها',
            media: result
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
            title: 'افزودن عکس'
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن عکس',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
    if(req.files.file && req.files.file[0]) {
        const file = req.files.file[0];
        const media = await Media.create({
            filename: file.filename,
            type: file.mimetype,
            media_url: file.path,
        });
        renderView(req, res, {
            media,
            redirect: '/admin/media'
        });
    } else {
        renderViewError(req, res, {
            errors: 'Upload File Error'
        });
    }

    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const media = await Media.findByPk(id);
        renderView(req, res, {
            title: 'ویرایش عکس',
            media
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش عکس',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const media = await Media.update(req.body,{
            where: { id }
        });
        renderView(req, res, {
            media,
            redirect: '/admin/media'
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

        const media = await Media.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            media,
            redirect: '/admin/media'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
