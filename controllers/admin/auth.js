const User = require('../../model/user');
const { renderView, renderViewError } = require('../../middleware/router');

const login = async (req, res, next) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        const user = await User.findByCredentials(mobile, password);
        if(!user) return res.redirect('/login');
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
            renderView(req, res, {
                user,
                redirect: '/admin'
            });
        });
    } catch(e) {
        res.redirect('/admin/login');
        renderViewError(req, res, {
            errors: e
        });
    }
};
const logout = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            console.log(err);
            res.redirect('/admin/login');
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

module.exports = {
    login,
    logout,
};
