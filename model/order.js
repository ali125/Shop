const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const OrderItem = require('./orderItem');
const Location = require('./location');

class Order extends Model {}

Order.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.TEXT
    },
    state_id: {
        type: DataTypes.INTEGER
    },
    city_id: {
        type: DataTypes.INTEGER
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'order',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id'
});
OrderItem.belongsTo(Order);

Order.hasOne(Location, {
    foreignKey: 'state_id'
});
Order.hasOne(Location, {
    foreignKey: 'city_id'
});
Order.hasOne(User, {
    foreignKey: 'user_id'
});
User.belongsTo(Order, {
    foreignKey: 'user_id'
});

Order.sync();
OrderItem.sync();

module.exports = Order;
