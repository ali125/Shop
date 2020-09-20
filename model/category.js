const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Product = require('./product');
const Post = require('./post');
const User = require('./user');
const { slugify } = require('../utils/string');

class Category extends Model {
    async getCategoryModels(options) {
        const product = await this.getProduct(options);
        return product.concat([]);
    }
}

Category.init({
   name: {
       type: DataTypes.STRING,
       allowNull: false
   },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val) {
            const slug = val ? val : this.getDataValue('name');
            this.setDataValue('slug', slugify(slug));
        }
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'category',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

class CategoryModel extends Model {}

CategoryModel.init({
    category_id: {
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
    modelName: 'category_model',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Category.hasMany(Category, {
   foreignKey: 'parent_id'
});

Category.belongsTo(User, {
    foreignKey: 'user_id'
});

Category.belongsToMany(Product, {
    through: {
        model: CategoryModel,
        unique: false
    },
    foreignKey: 'category_id',
    constraints: false
});

Product.belongsToMany(Category, {
    through: {
        model: CategoryModel,
        unique: false,
        scope: {
            model_type: 'product'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});

Category.belongsToMany(Post, {
    through: {
        model: CategoryModel,
        unique: false
    },
    foreignKey: 'category_id',
    constraints: false
});

Post.belongsToMany(Category, {
    through: {
        model: CategoryModel,
        unique: false,
        scope: {
            model_type: 'post'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});

Category.sync();
CategoryModel.sync();

module.exports = Category;
