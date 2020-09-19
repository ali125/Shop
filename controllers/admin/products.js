const _ = require("lodash");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator/check");
const Term = require('../../model/term');
const Termmeta = require('../../model/termmeta');
const Tag = require('../../model/tag');
const Category = require('../../model/category');
const Product = require('../../model/product');
const Stock = require('../../model/stock');
const Media = require('../../model/media');
const { getUniqueSlug, stripHtml } = require('../../utils/string');
const { renderView, renderViewError } = require('../../middleware/router');

const getAllTerms = async () => {
    let details = [];
    const ps = await Term.findOne({
        where: { slug: 'product-specifications' },
        include: [Term]
    });
    for(let i = 0 ; i < ps.terms.length ; i++) {
        const t = ps.terms[i];
        const td = await Term.findByPk(t.id, {
            include: [Termmeta, Term]
        });

        if(td.terms.length > 0) {
            const tdl = td;
            for(let j = 0 ; j < td.terms.length ; j++) {
                const ts = td.terms[j];
                const tds = await Term.findByPk(ts.id, {
                    include: [Termmeta]
                });
                tdl['terms'][j] = tds;

            }
            details = [...details, tdl]
        } else {
            details = [...details, td];
        }
    }
    return details;
};
const setStock = async (product, body, stocks, edit = false, res) => {
    try {
        if(stocks.length > 0) {
            for(let s = 0 ; s < stocks.length ; s++) {
                const stockItem = stocks[s];
                const media_item = stockItem.media;
                delete stockItem.media;
                if(stockItem.price.toString() !== "0" && stockItem.count.toString() !== "0") {
                    let stock_created = null;
                    if(edit && stockItem.id) {
                        await Stock.update({
                            price: stockItem.price,
                            count: Number(stockItem.count)
                        }, {
                            where: { id: stockItem.id }
                        });
                        stock_created = await Stock.findByPk(stockItem.id);
                        delete stockItem["id"];
                    } else {
                        stock_created = await Stock.create({
                            price: stockItem.price,
                            count: Number(stockItem.count),
                            product_id: product.id,
                            user_id: body.user_id
                        });
                    }
                    delete stockItem["price"];
                    delete stockItem["count"];
                    delete stockItem["media"];
                    _.map(stockItem, async (val, key) => {
                        let temmeta = null;
                        try {
                            if(val) await stock_created.setTermmeta(val, { through: { model_slug: key } } );
                        } catch(e) {
                            console.log('setTermmeta Errors: ', e);
                            return res.send(e);
                        }

                    });

                    const media_list = [];
                    if(media_item && media_item.length > 0) {
                        for(let m = 0 ; m < media_item.length ; m++) {
                            media_list.push(media_item[m]);
                        }
                        await stock_created.setMedia(media_list);
                    }
                }
            }
        }
    } catch(e) {
        console.log(e);
    }

};

exports.all = async (req, res, next) => {
    try {
        const data = await Product.findAll({
            include: [Category, {
                model: Stock,
                include: [Media],
                limit: 1
            }],
            // include: { association: 'stocks' }
        });
        // return res.send(data);
        renderView(req, res, {
            title: 'لیست محصولات',
            data
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Product.findByPk(id, {
            include: [
            {
                model: Stock,
                include: [Termmeta, Media]
            }]
        });
        let sub_stock = {};
        // return res.send(data);
        _.map(data.stocks, stock => {
            _.map(stock.termmeta, meta => {
                if(meta.stock_model.model_slug === 'colors') {
                    sub_stock = {
                        ...sub_stock,
                        [meta.id]: {
                            ...sub_stock[meta.id],
                            id: stock.id,
                            val: meta.meta_value,
                            text: meta.meta_key
                        }
                    };
                    for(let m = 0 ; m < stock.media.length ; m++) {
                        const media = stock.media[m];
                        if(typeof sub_stock[meta.id].media === "undefined") {
                            sub_stock = {
                                ...sub_stock,
                                [meta.id]: {
                                    ...sub_stock[meta.id],
                                    media: [
                                        media
                                    ]
                                }
                            }
                        } else {
                            sub_stock = {
                                ...sub_stock,
                                [meta.id]: {
                                    ...sub_stock[meta.id],
                                    media: [
                                        ...sub_stock[meta.id].media,
                                        media
                                    ]
                                }
                            }
                        }
                    }
                    for(let t = 0 ; t < stock.termmeta.length ; t++) {
                        const o_meta = stock.termmeta[t];
                        if(o_meta.stock_model.model_slug !== 'colors') {
                            const slug = o_meta.stock_model.model_slug;
                            const obj = {
                                id: o_meta.id,
                                stock_id: stock.id,
                                price: stock.price,
                                count: stock.count,
                                val: o_meta.meta_value,
                                text: o_meta.meta_key,
                            };
                            if(typeof sub_stock[meta.id][slug] === "undefined") {
                                sub_stock = {
                                    ...sub_stock,
                                    [meta.id]: {
                                        ...sub_stock[meta.id],
                                        [slug]: [
                                            obj
                                        ]
                                    }
                                }
                            } else {
                                sub_stock = {
                                    ...sub_stock,
                                    [meta.id]: {
                                        ...sub_stock[meta.id],
                                        [slug]: [
                                            ...sub_stock[meta.id][slug],
                                            obj
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
        const details = _.map(sub_stock, s => s);
        // return res.send(details);
        renderView(req, res, {
            title: data.title,
            ...data,
            details,
            content_text: stripHtml(data.content)
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.add = async (req, res, next) => {
    try {
        const details = await getAllTerms();
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن محصول',
            hasError: false,
            tags,
            details,
            categories
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'افزودن محصول',
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = await getUniqueSlug(Product, title, req.body.slug);
        let category_id = req.body.category_id;
        let tags = req.body.tags || [];
        let content = req.body.content;
        let stocks = req.body.stock;
        let user_id = req.session.user.id;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            if(stocks.length > 0) {
                for(let i = 0 ; i < stocks.length ; i++) {
                    const stock = stocks[i];
                    const media = stock.media || [];
                    if(media.length > 0) {
                        stock.media = await Media.findAll({
                            where: {
                                id: {
                                    [Op.in]: media
                                }
                            }
                        });
                    }
                }
            }
            const details = await getAllTerms();
            const allTags = await Tag.findAll();
            const categories = await Category.findAll();
            return renderView(req, res, {
                title: 'افزودن محصول',
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                tags: allTags,
                details,
                categories,
                product: {
                    title,
                    slug,
                    category_id,
                    tags,
                    content,
                    stocks
                }
            });
        }
        const body = {
            title,
            slug,
            content,
            user_id,
        };
        const product_created = await Product.create(body);
        await setStock(product_created, { ...req.body, user_id } , stocks, false, res);
        if(category_id && category_id !== 0) await product_created.setCategories(category_id);
        if(tags) await product_created.setTags(tags);
        const product = await Product.findByPk(product_created.id, {
            include: [Tag, Category, {
                model: Stock,
                include: [Termmeta]
            }],
        });
        // return res.send({product});
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
exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const details = await getAllTerms();
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        const product = await Product.findByPk(id, {
            include: [Tag, Category, {
                model: Stock,
                include: [Termmeta, Media]
            }]
        });
        renderView(req, res, {
            title: ' ویرایش محصول: ' + product.title,
            hasError: false,
            product,
            categories,
            details,
            tags
        });
    } catch(e) {
        renderViewError(req, res, {
            title: 'ویرایش محصول',
            errors: e
        });
    }
};
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const slug = await getUniqueSlug(Product, title, req.body.slug, id);
        let category_id = req.body.category_id;
        let inTags = req.body.tags || [];
        let content = req.body.content;
        let stocks = req.body.stock;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            if(stocks.length > 0) {
                for(let i = 0 ; i < stocks.length ; i++) {
                    const stock = stocks[i];
                    const media = stock.media || [];
                    if(media.length > 0) {
                        stock.media = await Media.findAll({
                            where: {
                                id: {
                                    [Op.in]: media
                                }
                            }
                        });
                    }
                }
            }
            const details = await getAllTerms();
            const allTags = await Tag.findAll();
            const categories = await Category.findAll();
            // return res.send({
            //     product: {
            //         title,
            //         slug,
            //         category_id,
            //         tags: inTags,
            //         content,
            //         stocks
            //     }
            // })
            return renderView(req, res, {
                title: 'افزودن محصول',
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                tags: allTags,
                details,
                categories,
                product: {
                    id,
                    title,
                    slug,
                    category_id,
                    tags: inTags,
                    content,
                    stocks
                }
            });
        }
        const body = {
            title,
            slug,
            content
        };
        const get_product = await Product.findByPk(id, {
            include: [Stock, Tag]
        });

        await Product.update(body,{
            where: { id }
        });
        // return res.send({ stocks });
        await setStock(get_product, req.body, stocks, true);
        const tags = _.filter(get_product.tags, t => inTags.indexOf(t.id) === -1);
        if(tags) await get_product.setTags(tags);
        if(category_id && category_id !== 0) await get_product.setCategories(category_id);
        const product = await Product.findByPk(get_product.id, {
            include: [Tag, Category, {
                model: Stock,
                include: [Termmeta, Media]
            }]
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
exports.destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id, {
            include: [Stock]
        });
        for(let s = 0 ; s < product.stocks.length ; s++) {
            const stock = product.stocks[s];
            await Stock.destroy({
                where: { id: stock.id },
                force: true
            });
        }
        await Product.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            product,
            redirect: '/admin/products'
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
