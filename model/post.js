const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const User = require('./user');
const { truncateText } = require('../utils/string');

class Post extends Model {}


Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'compositeIndex'
    },
    image: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.media.length > 0 ? this.media[0] : null
        }
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
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'post'
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 2 // 1 => draft, 2 => published
    }
}, {
    sequelize,
    modelName: 'post',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.sync();

module.exports = Post;
