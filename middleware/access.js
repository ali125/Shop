const Role = require('../model/role');
const Permission = require('../model/permission');

const url_access = [
    '/user/add'
];

const access = (permission = 'profile') => {
    return async (req, res, next) => {
        try {
            const role = await Role.findOne({
                where: {
                    id: req.user.role_id
                },
                include: Permission
            });
            const hasPermission = role.permissions.filter(p => p.slug === permission)[0];
            if(!hasPermission) {
                throw new Error();
            }
            next();
        } catch(e) {
            res.status(403).send({ error: 'Access denied!' });
        }
    }
};

module.exports = access;
