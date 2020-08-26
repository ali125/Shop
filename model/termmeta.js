const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Term = require('./term');

class TermMeta extends Model {}

TermMeta.init({
    term_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    meta_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meta_value: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'termmeta',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


TermMeta.belongsTo(Term, {
    foreignKey: 'term_id',
    onDelete: 'cascade'
});

Term.hasMany(TermMeta, {
    foreignKey: 'term_id',
    onDelete: 'cascade'
});

TermMeta.sync();

module.exports = TermMeta;
