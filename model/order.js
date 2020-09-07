const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const OrderItem = require('./orderItem');
const Address = require('./address');

class Order extends Model {}

Order.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    address_id: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'order',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


// OrderItem.belongsTo(Order, {
//     foreignKey: 'order_id'
// });
Order.hasMany(OrderItem, {
    foreignKey: 'order_id'
});
Address.hasOne(Order, {
    foreignKey: 'address_id'
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
