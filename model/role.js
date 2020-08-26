const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Permission = require("./permission");

class Role extends Model { }

Role.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: null
    },
}, {
    sequelize,
    modelName: 'role',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

class RolePermission extends Model {}
RolePermission.init({
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: 'permission_role',
    modelName: 'permission_role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id'
});
Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id'
});

Role.sync();
RolePermission.sync();

module.exports = Role;
