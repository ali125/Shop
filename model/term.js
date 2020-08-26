const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');

class Term extends Model {
    async getTermModels(options) {
        const product = await this.getTermmeta(options);
        return product.concat([]);
    }
}

Term.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'string'
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: 'term',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Term.hasMany(Term, {
    foreignKey: 'parent_id',
    onDelete: 'cascade'
});

Term.sync();

module.exports = Term;
