const User = require('../../model/user');
const Tag = require('../../model/tag');
const Category = require('../../model/category');
const Product = require('../../model/product');
const Stock = require('../../model/stock');
const Media = require('../../model/media');
const { renderView, renderViewError } = require('../../middleware/router');

const all = async (req, res, next) => {
    try {
        const result = await Product.findAll({
            include: [Category, Media]
        });
        renderView(req, res, {
            title: 'لیست محصولات',
            products: result
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const add = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن محصول',
            users,
            tags,
            categories
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن محصول',
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const stock = req.stock;
        if(stock.length > 0) {
            stock.forEach(async item => {
                const media_item = body.media_id;
                delete stock.media;
                const stock_created = await Stock.create({
                    ...stock,
                    product_id: product_created.id,
                    user_id: body.user_id
                });
                if(media_item.length > 0) {
                    media_item.forEach(async media_id => {
                        if(media_id) {
                            for(let m = 0 ; m < media_id.length ; m++) {
                                const media = await Media.findByPk(media_id[m]);
                                stock_created.setMedia(media)
                            }
                        }
                    });

                }
            });
        }
        if(body.category_id && body.category_id == 0) delete body.category_id;
        const product_created = await Product.create(body);
        const stock_created = await Stock.create({
            product_id: product_created.id,
            user_id: body.user_id
        });
        const categories = (req.body.category_id && req.body.category_id !== 0) ? await product_created.setCategories(req.body.category_id) : [];
        const tags = (req.body.tags) ? await product_created.setTags(req.body.tags) : [];
        const product = await Product.findByPk(product_created.id, {
            include: [Tag, Category],
        });
        // const media = req.files.media;
        // if(media && media.length > 0) {
        //     const mediasData = [];
        //     for(let m = 0 ; m < media.length ; m++)
        //         mediasData.push({
        //             filename: media[m].filename,
        //             media_url: media[m].path,
        //             type: media[m].mimetype
        //         });
        //     const medias = await Media.bulkCreate(mediasData);
        //     await product_created.setMedia(medias);
        // }
        if(media_id) {
            for(let m = 0 ; m < media_id.length ; m++) {
                const media = await Media.findByPk(media_id[m]);
                product_created.setMedia(media)
            }
        }
        renderView(req, res, {
            product,
            redirect: '/admin/products'
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
        const tags = await Tag.findAll();
        const users = await User.findAll();
        const categories = await Category.findAll();
        const product = await Product.findByPk(id, {
            include: [Tag, Category]
        });
        // res.send(product);
        renderView(req, res, {
            title: 'ویرایش محصول',
            users,
            product,
            categories,
            tags
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش محصول',
            errors: e
        });
    }
};
const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const get_product = await Product.findByPk(id);
        const product_edited = await Product.update(req.body,{
            where: { id }
        });
        const tags = (req.body.tags) ? await get_product.setTags(req.body.tags) : [];
        const categories = (req.body.category_id && req.body.category_id !== 0) ? await get_product.setCategories(req.body.category_id) : [];
        const product = await Product.findByPk(get_product.id, {
            include: [Tag, Category],
        });
        renderView(req, res, {
            product,
            redirect: '/admin/products'
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
        const product = await Product.findByPk(id, {
            include: [Media]
        });
        // const product = await Media;
        // const product = await Product.destroy({
        product.removeMedia(product.media);
        await Product.destroy({
            where: { id },
            force: true
        });
        //     where: { id },
        //     force: true
        // });
        renderView(req, res, {
            product,
            redirect: '/admin/products'
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
