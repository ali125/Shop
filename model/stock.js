const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const Product = require('./product');
const Termmeta = require('./termmeta');

class Stock extends Model {}

Stock.init({
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        set(val) {
            this.setDataValue('price', Number(val));
        }
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'stock',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

class Stock_Model extends Model {}
Stock_Model.init({
    stock_id: {
        type: DataTypes.INTEGER,
        unique: false,
    },
    model_id: {
        type: DataTypes.INTEGER,
        unique: false,
    },
    model_type: {
        type: DataTypes.STRING,
        unique: false,
    },
    model_slug: {
        type: DataTypes.STRING,
        unique: false,
    },
}, {
    sequelize,
    modelName: 'stock_model',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


Stock.belongsTo(User, {
    foreignKey: 'user_id'
});
Product.hasMany(Stock, {
    foreignKey: 'product_id'
});
Stock.belongsTo(Product, {
    foreignKey: 'product_id'
});
Stock.belongsToMany(Termmeta, {
    through: {
        model: Stock_Model,
        unique: false,
        scope: {
            model_type: 'termmeta'
        }
    },
    foreignKey: 'stock_id'
});
Termmeta.belongsToMany(Stock, {
    through: {
        model: Stock_Model,
        unique: false,
        scope: {
            model_type: 'termmeta'
        }
    },
    foreignKey: 'model_id'
});

Stock.sync();
Stock_Model.sync();

module.exports = Stock;
