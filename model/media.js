const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const Post = require('./post');
const Product = require('./product');
const Stock = require('./stock');

class Media extends Model {
    async getMediaModels(options) {
//         const product = await this.getProduct(options);
        const stock = await this.getStock(options);
        // const videos = await this.getVideos(options);
        // Concat images and videos in a single array of mediagables
        // return images.concat(videos);
        return stock.concat([]);
    }
}
Media.init({
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    media_url: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('media_url').substr(6);
        }
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'image'
    },
}, {
    sequelize,
    modelName: 'media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Here we define the junction model explicitly
class Media_Model extends Model {}
Media_Model.init({
    media_id: {
        type: DataTypes.INTEGER,
        unique: 'tt_unique_constraint'
    },
    model_id: { // model_id
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
    modelName: 'media_model',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Stock.belongsToMany(Media, {
    through: {
        model: Media_Model,
        unique: false,
        scope: {
            model_type: 'stock'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});
Media.belongsToMany(Stock, {
    through: {
        model: Media_Model,
        unique: false
    },
    foreignKey: 'media_id',
    constraints: false
});

Post.belongsToMany(Media, {
    through: {
        model: Media_Model,
        unique: false,
        scope: {
            model_type: 'post'
        }
    },
    foreignKey: 'model_id',
    constraints: false
});
Media.belongsToMany(Post, {
    through: {
        model: Media_Model,
        unique: false
    },
    foreignKey: 'media_id',
    constraints: false
});

Media_Model.sync();
Media.sync();

module.exports = Media;
