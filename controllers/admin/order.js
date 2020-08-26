const _ = require('lodash');
const Stock = require('../../model/stock');
const Order = require('../../model/order');
const OrderItem = require('../../model/orderItem');
const Media = require('../../model/media');
const Product = require('../../model/product');
const { renderView, renderViewError } = require('../../middleware/router');

const getInfo = async (req, res, next) => {
    try {
        renderView(req, res, {
            title: 'ثبت اطلاعات گیرنده'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
const get = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const data = await Order.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                include: [Media, Product]
            }]
        });
        // return res.send(data);
        renderView(req, res, {
            title: 'سبد خرید',
            data
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
const save = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const stock_id = req.params.id;
        let order = await Order.findOne({
            where: { user_id },
            include: [Stock]
        });
        if(!order) {
            order = await Order.create({ user_id });
        }
        let quantity = 1;
        const inStock = _.find(order.stocks, s => s.id.toString() === stock_id.toString());
        if(inStock) {
            quantity = Number(inStock.orderItem.quantity) + 1;
            const order_id = inStock.orderItem.order_id;
            await OrderItem.update({ quantity }, {
                where: {
                    stock_id,
                    order_id
                }
            });
        } else {
            await order.addStock(stock_id, { through: { quantity } });
        }
        const data = await Order.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                where: {
                    id: stock_id
                }
            }]
        });
        renderView(req, res, {
            redirect: '/orders',
            data
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
const remove = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const stock_id = req.params.id;
        const order = await Order.findOne({
            where: { user_id },
            include: [Stock]
        });
        const inStock = _.find(order.stocks, s => s.id.toString() === stock_id.toString());
        if(!inStock) {
            renderView(req, res, {
                data: null,
                redirect: '/orders'
            });
        }
        const quantity = Number(inStock.orderItem.quantity) - 1;
        const order_id = inStock.orderItem.order_id;
        if(quantity > 0) {
            await OrderItem.update({ quantity }, {
                where: {
                    stock_id,
                    order_id
                }
            });
        } else {
            await OrderItem.destroy({
                where: {
                    stock_id,
                    order_id
                }
            });
        }

        const data = await Order.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                where: {
                    id: stock_id
                }
            }]
        });
        renderView(req, res, {
            data,
            redirect: '/orders'
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
        const data = await Order.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/orders'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    getInfo,
    get,
    save,
    remove,
    destroy
};
