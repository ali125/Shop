const jwt = require('jsonwebtoken');
const TokenInstance = require('../model/tokenInstance');
const User = require('../model/user');

const authApi = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const instance = await TokenInstance.findOne({
            where: {
                instance_id: decoded.id,
                token,
                active: 1
            }
        });
        if(!instance) {
            throw new Error();
        }
        const user = await User.findOne({
            where: {
                id: decoded.id
            }
        });
        req.token = token;
        req.user = user;
        next();
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.'});
    }
};

const auth = async (req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        if(!isLoggedIn) return res.redirect('/admin/login');
        next();
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.'});
    }
};

module.exports = auth;
