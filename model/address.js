const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const Location = require('./location');
const { truncateText } = require('../utils/string');

class Address extends Model {}


Address.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    short_address: {
        type: DataTypes.VIRTUAL,
        get() {
            return truncateText(this.address, 50)
        }
    },
    latitude: {
        type: DataTypes.DECIMAL(11,8),
        defaultValue: null
    },
    longitude: {
        type: DataTypes.DECIMAL(11,8),
        defaultValue: null
    },
    phone: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.STRING,
        validate: {
            len: [11]
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'address',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

User.hasMany(Address, {
    foreignKey: 'user_id'
});
Address.belongsTo(User, {
    foreignKey: 'user_id'
});

Address.belongsTo(Location, {
    foreignKey: 'state_id',
    as: 'state'
});
Address.belongsTo(Location, {
    foreignKey: 'city_id',
    as: 'city'
});

Address.sync();

module.exports = Address;
