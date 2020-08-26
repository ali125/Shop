const _ = require("lodash");
const Term = require('../../model/term');
const Termmeta = require('../../model/termmeta');
const User = require('../../model/user');
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
const setStock = async (product, body, stocks, edit = false) => {
    try {
        if(stocks.length > 0) {
            for(let s = 0 ; s < stocks.length ; s++) {
                const stockItem = stocks[s];
                const media_item = stockItem.media;
                delete stockItem.media;
                if(stockItem.price.toString() !== "0" && stockItem.count.toString() !== "0") {
                    let stock_created = null;
                    if(s === 1) debugger;
                    if(edit && stockItem.id) {
                        await Stock.update({
                            price: stockItem.price,
                            count: Number(stockItem.count),
                            user_id: body.user_id
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
                    if(s === 1) debugger;
                    delete stockItem["price"];
                    delete stockItem["count"];
                    delete stockItem["media"];
                    _.map(stockItem, async (val, key) => {
                        if(val) await stock_created.addTermmeta(val, { through: { model_slug: key } } );
                    });
                    const media_list = []
                    if(media_item && media_item.length > 0) {
                        for(let m = 0 ; m < media_item.length ; m++) {
                            media_list.push(media_item[m]);
                            // const media_id = media_item[m];
                            // if (media_id) {
                            //     for (let m = 0; m < media_id.length; m++) {
                            //         const media = await Media.findByPk(media_id[m]);
                            //         stock_created.setMedia(media)
                            //     }
                            // }
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

const all = async (req, res, next) => {
    try {
        const data = await Product.findAll({
            include: [Category, {
                model: Stock,
                include: [Media],
                limit: 1
            }],
            // include: { association: 'stocks' }
        });
        return res.send(data);
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
const get = async (req, res, next) => {
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
const add = async (req, res, next) => {
    try {
        const details = await getAllTerms();
        // res.send(details);
        const users = await User.findAll();
        const tags = await Tag.findAll();
        const categories = await Category.findAll();
        renderView(req, res, {
            title: 'افزودن محصول',
            users,
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
const save = async (req, res, next) => {
    try {
        // return res.send(req.body);
        let stock = req.body.stock;
        let body = req.body;
        delete body.stock;
        if(body.category_id && body.category_id.toString() === "0") delete body.category_id;
        const slug = await getUniqueSlug(Product, body.title, body.slug);
        const product_created = await Product.create({
            ...body,
            slug
        });
        await setStock(product_created, body, stock);
        const categories = (req.body.category_id && req.body.category_id !== 0) ? await product_created.setCategories(req.body.category_id) : [];
        const tags = (req.body.tags) ? await product_created.setTags(req.body.tags) : [];
        const product = await Product.findByPk(product_created.id, {
            include: [Tag, Category, {
                model: Stock,
                include: [Termmeta]
            }],
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
const edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const details = await getAllTerms();
        const tags = await Tag.findAll();
        const users = await User.findAll();
        const categories = await Category.findAll();
        const product = await Product.findByPk(id, {
            include: [Tag, Category, {
                model: Stock,
                include: [Termmeta, Media]
            }]
        });
        // res.send(product);
        renderView(req, res, {
            title: ' ویرایش محصول: ' + product.title,
            users,
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
const update = async (req, res, next) => {
    try {
        // return res.send(req.body);
        const id = req.params.id;
        const body = req.body;
        const get_product = await Product.findByPk(id, {
            include: [Stock, Tag]
        });
        const slug = await getUniqueSlug(Product, body.title, body.slug);
        await Product.update({
            ...body,
            slug
        },{
            where: { id }
        });
        await setStock(get_product, body, body.stock, true);
        const tags = _.filter(get_product.tags, t => body.tags.indexOf(t.id) === -1);
        if(tags) await get_product.setTags(tags);
        if(body.category_id && body.category_id !== 0) await get_product.setCategories(body.category_id);
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
const destroy = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id, {
            include: [Media, Stock]
        });

        // const product = await Media;

        // const product = await Product.destroy({
        // product.removeStock(product.stocks);
        // if(product.stocks)
        for(let s = 0 ; s < product.stocks.length ; s++) {
            const stock = product.stocks[s];
            await Stock.destroy({
                where: { id: stock.id },
                force: true
            });
        }
        // return res.send(product);
        // res.send(product);
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
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    all,
    get,
    add,
    save,
    edit,
    update,
    destroy
};
