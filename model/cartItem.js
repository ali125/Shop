const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');

class CartItem extends Model {}

CartItem.init({
    cart_id: {
        type: DataTypes.INTEGER
    },
    stock_id: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'cartItem',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

CartItem.sync();

module.exports = CartItem;
