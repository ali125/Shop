const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Stock = require('./stock');
const CartItem = require('./cartItem');
const User = require('./user');

class Cart extends Model {}

Cart.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'cart',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasOne(Cart, {
    foreignKey: 'user_id'
});
Cart.belongsTo(User, {
    foreignKey: 'user_id'
});
Cart.belongsToMany(Stock, {
    through: {
        model: CartItem,
        unique: false,
    },
    foreignKey: 'cart_id'
});
Stock.belongsToMany(Cart, {
    through: {
        model: CartItem,
        unique: false,
    },
    foreignKey: 'stock_id'
});

Cart.sync();

module.exports = Cart;
