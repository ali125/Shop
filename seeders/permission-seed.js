const Permission = require('../model/permission');

const PermissionSeed = async (cb) => {
    try {
        const permissions = [
            await Permission.build({
                title: 'Add User',
                slug: 'add_user'
            }),
            await Permission.build({
                title: 'Edit User',
                slug: 'edit_user'
            }),
            await Permission.build({
                title: 'Delete User',
                slug: 'delete_user'
            }),
        ];
        let done = 0;
        for (let i = 0; i < permissions.length; i++) {
            await permissions[i].save().then(()=>{
                done++;
                if(done === permissions.length){
                    cb();
                    console.log('Finished permission insert');
                    // sequelize.close();
                }
            })
        }
    } catch (e) {
        console.log('PermissionSeed Error: ', e);
    }
};

module.exports = PermissionSeed;
