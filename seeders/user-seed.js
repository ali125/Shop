const User = require('../model/user');

const UserSeed = async (cb) => {
    try{
        const users = [
            await User.build({
                username: 'admin',
                first_name: 'Ali',
                last_name: 'Mortazavi',
                email: 'admin@example.com',
                mobile: '09123456789',
                password: 'password',
                role_id: 1
            }),
            await User.build({
                username: 'user',
                first_name: 'Mohammad',
                last_name: 'Mortazavi',
                email: 'user@example.com',
                mobile: '09987654321',
                password: 'password',
                role_id: 2
            }),
        ];
        let done = 0;
        for (let i = 0; i < users.length; i++) {
            await users[i].save().then(()=>{
                done++;
                if(done === users.length){
                    cb();
                    console.log('Finished user insert');
                }
            })
        }
    } catch (e) {
        console.log('UserSeed Error: ', e);
    }
};

module.exports = UserSeed;
