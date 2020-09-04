const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');

class Location extends Model {}

Location.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    language_id: DataTypes.INTEGER,
    latitude: DataTypes.DECIMAL(11,8),
    longitude: DataTypes.DECIMAL(11,8),
    country_id: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER,
    geo_json: {
        type: DataTypes.TEXT,
        get() {
            return;
        },
    },
}, {
    sequelize,
    modelName: 'location',
    paranoid: true,
    deletedAt: 'deleted_at',
    timestamps: false
});

Location.hasMany(Location, {
    foreignKey: 'country_id',
    as: 'states'
});
Location.belongsTo(Location, {
    foreignKey: 'country_id'
});
Location.hasMany(Location, {
    foreignKey: 'state_id',
    as: 'cities'
});
Location.belongsTo(Location, {
    foreignKey: 'state_id'
});

Location.sync();

module.exports = Location;
