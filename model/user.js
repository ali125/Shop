const { Model, DataTypes, UUIDV1 } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./databaseConfig');
const TokenInstance = require('./tokenInstance');
const Role = require('./role');

class User extends Model {
    static async findByCredentials(mobile, password) {
        const user = await User.findOne({
            where: { mobile },
            include: Role
        });
        if(!user) {
            throw new Error('Unable to login');
        }
        const hashPassword = user.getDataValue('password');
        const isMatch = bcrypt.compareSync(password, hashPassword);
        if(!isMatch) {
            throw new Error('Password wrong, Unable to login');
        }
        return user;
    }
    async generateAuthToken() {
        try {
            // const user = this.dataValues;
            const user = this;
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
            // TokenInstance.sync();
            await TokenInstance.create({
                instance_id: user.id,
                token
            });
            return token;
        } catch(e) {
            throw new Error('Unable to login');
        }

        return {};
    }

}

User.init({
    username: {
        type: DataTypes.STRING,
        defaultValue: UUIDV1,
        allowNull: false,
        set(value) {
            const username = value ? value : this.first_name + (Math.random(999999) * 10000).toFixed();
            this.setDataValue('username', username);
        }
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.first_name} ${this.last_name}`
        },
        set(value) {
            throw new Error('Do not try to set the `full_name` value!');
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    mobile: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            len: [11]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return;
        },
        set(value) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash)
        },
    },
    avatar_url: {
        type: DataTypes.STRING,
        get() {
            const avatar_url = this.getDataValue('avatar_url');
            return avatar_url ? avatar_url.substr(6) : null;
        }
    },
    gender: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    },
    verified: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

User.hasMany(User, {
    foreignKey: 'user_id'
});

User.hasMany(TokenInstance, {
    foreignKey: 'instance_id'
});

Role.hasMany(User, {
    foreignKey: 'role_id'
});

User.belongsTo(Role, {
    foreignKey: 'role_id'
});

User.sync();

module.exports = User;
