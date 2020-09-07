const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');

class Permission extends Model { }

Permission.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    section_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    route_url: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: null
    },
}, {
    sequelize,
    modelName: 'permission',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

Permission.sync();

module.exports = Permission;
