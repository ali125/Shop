const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const Stock = require('./stock');
const { truncateText, slugify } = require('../utils/string');

class Product extends Model {}


Product.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex',
        // set(val) {
        //     const slug = val ? val : this.getDataValue('title');
            // this.setDataValue('slug', slugify(slug));
            // let slugVal = slugify(slug);
            // Product.findAll({
            //     where: { slug: slugVal }
            // }).then(products => {
            //     slugVal = products.length > 0 ? slugVal + products.length : slugVal;
            //     this.setDataValue('slug', slugVal);
            // });
        // }
    },
    image_url: {
        type: DataTypes.STRING,
        get() {
            const image_url = typeof this.stocks !== "undefined" && this.stocks.length > 0 ?
                    typeof this.stocks[0].media !== "undefined" && this.stocks[0].media.length > 0 ?
                    this.stocks[0].media[0] : null
                : null;
            return image_url
        }
        // get() {
        //     return this.getDataValue('image_url') ?
        //         this.getDataValue('image_url').substr(6) : null;
        // }
    },
    content: {
        type: DataTypes.TEXT
    },
    short_content: {
        type: DataTypes.VIRTUAL,
        set(val) {
            throw new Error('Do not try to set the `short_content` value!');
        },
        get() {
            return truncateText(this.content, 50)
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1 // 1 => opened, 0 => closed
    },
    comment_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // type: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     defaultValue: 'post'
    // },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 2 // 1 => draft, 2 => published
    }
}, {
    sequelize,
    modelName: 'product',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

User.hasMany(Product, {
    foreignKey: 'user_id'
});

Product.sync();

module.exports = Product;
