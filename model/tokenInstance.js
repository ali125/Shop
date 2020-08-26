const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');

class TokenInstance extends Model {}

TokenInstance.init({
    instance_id: {
        type: DataTypes.INTEGER
    },
    token: {
        type: DataTypes.STRING,
    },
    active: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
    }
}, {
    sequelize,
    modelName: 'token_instance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

TokenInstance.sync();

module.exports = TokenInstance;
