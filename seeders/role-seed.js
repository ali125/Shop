const Role = require('../model/role');

const RoleSeed = async (cb) => {
    try{
        const roles = [
            await Role.build({
                title: 'Admin',
                slug: 'admin'
            }),
            await Role.build({
                title: 'Client',
                slug: 'client'
            }),
        ];
        let done = 0;
        for (let i = 0; i < roles.length; i++) {
            await roles[i].save().then(async role=>{
                done++;
                await role.addPermissions([1, 2, 3]);
                if(done === roles.length){
                    cb();
                    console.log('Finished roles insert');
                }
            })
        }
    } catch (e) {
        console.log('RoleSeed Error: ', e);
    }
};

module.exports = RoleSeed;
