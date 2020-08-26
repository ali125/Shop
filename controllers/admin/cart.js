const _ = require('lodash');
const Stock = require('../../model/stock');
const Cart = require('../../model/cart');
const CartItem = require('../../model/cartItem');
const Media = require('../../model/media');
const Product = require('../../model/product');
const { renderView, renderViewError } = require('../../middleware/router');

const get = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const data = await Cart.findOne({
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
        let cart = await Cart.findOne({
            where: { user_id },
            include: [Stock]
        });
        if(!cart) {
            cart = await Cart.create({ user_id });
        }
        let quantity = 1;
        const inStock = _.find(cart.stocks, s => s.id.toString() === stock_id.toString());
        if(inStock) {
            quantity = Number(inStock.cartItem.quantity) + 1;
            const cart_id = inStock.cartItem.cart_id;
            await CartItem.update({ quantity }, {
                where: {
                    stock_id,
                    cart_id
                }
            });
        } else {
            await cart.addStock(stock_id, { through: { quantity } });
        }
        const data = await Cart.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                where: {
                    id: stock_id
                }
            }]
        });
        renderView(req, res, {
            redirect: '/carts',
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
        const cart = await Cart.findOne({
            where: { user_id },
            include: [Stock]
        });
        const inStock = _.find(cart.stocks, s => s.id.toString() === stock_id.toString());
        if(!inStock) {
            renderView(req, res, {
                data: null,
                redirect: '/carts'
            });
        }
        const quantity = Number(inStock.cartItem.quantity) - 1;
        const cart_id = inStock.cartItem.cart_id;
        if(quantity > 0) {
            await CartItem.update({ quantity }, {
                where: {
                    stock_id,
                    cart_id
                }
            });
        } else {
            await CartItem.destroy({
                where: {
                    stock_id,
                    cart_id
                }
            });
        }

        const data = await Cart.findOne({
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
            redirect: '/carts'
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
        const data = await Cart.destroy({
            where: { id },
            force: true
        });
        renderView(req, res, {
            data,
            redirect: '/carts'
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    get,
    save,
    remove,
    destroy
};
