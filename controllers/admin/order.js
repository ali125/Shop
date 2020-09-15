const _ = require('lodash');
const Location = require('../../model/location');
const Address = require('../../model/address');
const Stock = require('../../model/stock');
const Cart = require('../../model/cart');
const Order = require('../../model/order');
const OrderItem = require('../../model/orderItem');
const Media = require('../../model/media');
const Product = require('../../model/product');
const User = require('../../model/user');
const { renderView, renderViewError } = require('../../middleware/router');

exports.all = async (req, res, next) => {
    try {
        const data = await Order.findAll({
            include: [User, {
                model: OrderItem
            }]
        });

        renderView(req, res, {
            title: 'لیست سفارشات',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

exports.getInfo = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const cart = await Cart.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                include: [Media, Product]
            }]
        });
        const addresses = await Address.findAll({
            where: { user_id: user_id },
            include: [
                {
                    model: Location,
                    as: 'state'
                },
                {
                    model: Location,
                    as: 'city'
                }
            ]
        });

        renderView(req, res, {
            title: 'ثبت اطلاعات گیرنده',
            cart,
            addresses
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.save = async (req, res, next) => {
    try {
        const user_id = req.session.user.id;
        const cart = await Cart.findOne({
            where: { user_id },
            include: [{
                model: Stock,
                include: [Media, Product]
            }]
        });
        const description = req.body.description;
        const address_id = req.body.address_id;
        const address = await Address.findByPk(address_id, {
            include: [
                User,
                {
                    model: Location,
                    as: 'state'
                },
                {
                    model: Location,
                    as: 'city'
                }
            ]
        });
        const address_text = {
            state: {
                id: address.state.id,
                name: address.state.name
            },
            city: {
                id: address.city.id,
                name: address.city.name,
            },
            address: address.address,
            short_address: address.short_address,
            phone: address.phone,
            mobile: address.mobile,
            latitude: address.latitude,
            longitude: address.longitude,
            user: address.user
        };
        const body = {
            code: 'SH' + new Date().getTime(),
            description,
            address_id,
            user_id,
            address: JSON.stringify(address_text)
        };
        const order = await Order.create(body);
        if(cart.stocks.length > 0) {
            for(let c = 0 ; c < cart.stocks.length ; c++){
                const item = cart.stocks[c];
                const itemBody = {
                    stock_id: item.id,
                    // product_id: item.product.id,
                    title: item.product.title,
                    slug: item.product.slug,
                    price: item.price,
                    quantity: item.cartItem.quantity,
                    data: "{}"
                };
                await order.createOrderItem(itemBody);
            }
        }
        await Cart.destroy({
            where: { user_id }
        });
        renderView(req, res, {
            redirect: '/orders'
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

exports.remove = async (req, res, next) => {
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
exports.destroy = async (req, res, next) => {
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
