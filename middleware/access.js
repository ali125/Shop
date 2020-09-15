const _ = require('lodash');
const { renderViewError } = require('./router');
const User = require('../model/user');
const Role = require('../model/role');
const Permission = require('../model/permission');

const url_access = [
    '/user/add'
];

// const access = (permission = 'profile') => {
//     return async (req, res, next) => {
//         try {
//             const role = await Role.findOne({
//                 where: {
//                     id: req.user.role_id
//                 },
//                 include: Permission
//             });
//             const hasPermission = role.permissions.filter(p => p.slug === permission)[0];
//             if(!hasPermission) {
//                 throw new Error();
//             }
//             next();
//         } catch(e) {
//             res.status(403).send({ error: 'Access denied!' });
//         }
//     }
// };

const access = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const user = await User.findOne({
            where: { id: userId },
            include: [{
                model: Role,
                include: Permission
            }]
        });
        let allowed = false;
        const originalUrl = req.originalUrl;

        _.map(user.role.permissions, p => {
            if(p.route_url && !allowed) {
                let route_url = p.route_url;
                _.map(req.params, (val, key) => {
                    route_url = route_url.replace(':'+key, val);

                });
                if(route_url === originalUrl) allowed = true;
            }
        });

        if(!allowed) throw new Error('Access denied!');
        next();
    } catch(e) {
        return renderViewError(req, res,{
            status: 403,
            errors: 'Access denied!'
        });
        // return res.status(403).send({ error: 'Access denied!' });
    }
};

module.exports = access;
