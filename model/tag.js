const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Product = require('./product');
const Post = require('./post');
const { slugify } = require('../utils/string');

class Tag extends Model {
    async getTagModels(options) {
        const product = await this.getProduct(options);
        return product.concat([]);
    }
}

Tag.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val) {
            const slug = val ? val : this.getDataValue('name');
            this.setDataValue('slug', slugify(slug));
        }
    }
}, {
    sequelize,
    modelName: 'tag',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

class Tag_Model extends Model {}
Tag_Model.init({
    tag_id: {
        type: DataTypes.INTEGER,
        unique: 'tt_unique_constraint'
    },
    model_id: {
        type: DataTypes.INTEGER,
        unique: 'tt_unique_constraint',
        references: null
    },
    model_type: {
        type: DataTypes.STRING,
        unique: 'tt_unique_constraint'
    }
}, {
    sequelize,
    modelName: 'tag_model',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Tag.belongsToMany(Product, {
    through: {
        model: Tag_Model,
        unique: false
    },
    foreignKey: 'tag_id',
    constraints: false
});

Product.belongsToMany(Tag, {
    through: {
        model: Tag_Model,
        unique: false,
        scope: {
            model_type: 'product'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});

Tag.belongsToMany(Post, {
    through: {
        model: Tag_Model,
        unique: false
    },
    foreignKey: 'tag_id',
    constraints: false
});

Post.belongsToMany(Tag, {
    through: {
        model: Tag_Model,
        unique: false,
        scope: {
            model_type: 'post'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});

Tag.sync();
Tag_Model.sync();

module.exports = Tag;
