const Product = require('../../model/product');
const Stock = require('../../model/stock');
const Media = require('../../model/media');
const { renderView, renderViewError } = require('../../middleware/router');

const get = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Stock,
                include: Media,
                limit: 20
            }]
        });
        renderView(req, res, {
            title: 'لیست کاربران',
            products
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
