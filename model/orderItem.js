const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Stock = require('./stock');

class OrderItem extends Model {}

OrderItem.init({
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING
    },
    slug: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    data: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'orderItem',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

OrderItem.hasOne(Stock, {
    foreignKey: 'stock_id'
});

module.exports = OrderItem;
