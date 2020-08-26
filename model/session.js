const { Model, DataTypes } = require('sequelize');
const sequelize = require('./databaseConfig');
const session = require("express-session");
const SessionStore = require("connect-session-sequelize")(session.Store);
class Session extends Model {}

Session.init({
    sid: { // This wont allow to sync model, I don't know why
        type: DataTypes.STRING,
        primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
}, {
    sequelize,
    modelName: 'session',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

function extendDefaultFields(defaults, session) {
    return {
        data: defaults.data,
        expires: defaults.expires,
        userId: session.userId,
    };
}

const store = new SessionStore({
    db: sequelize,
    table: "session",
    extendDefaultFields: extendDefaultFields,
});

// Session.sync();

module.exports = store;
