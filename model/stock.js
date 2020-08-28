const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
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
    stock_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER,
    model_type: DataTypes.STRING,
    model_slug: DataTypes.STRING
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

Stock.belongsToMany(Termmeta, {
    through: {
        model: Stock_Model,
        unique: false,
        scope: {
            model_type: 'termmeta'
        }
    },
    foreignKey: 'stock_id',
    constraints: false
});
Termmeta.belongsToMany(Stock, {
    through: {
        model: Stock_Model,
        unique: false,
        scope: {
            model_type: 'termmeta'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});

Stock.sync();
Stock_Model.sync();

module.exports = Stock;
