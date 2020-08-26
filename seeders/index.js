const sequelize = require('../model/databaseConfig');
const PermissionSeed = require('./permission-seed');
const RoleSeed = require('./role-seed');
const UserSeed = require('./user-seed');
const CategorySeed = require('./category-seed');
const TagSeed = require('./tag-seed');
const TermSeed = require('./term-seed');
const ProductSeed = require('./product-seed');
const StockSeed = require('./stock-seed');

sequelize.authenticate().then(async () => {
    await CategorySeed();
    await TagSeed();
    await TermSeed();
    await PermissionSeed(async () => {
        await RoleSeed(async () => {
            await UserSeed(async () => {
                await ProductSeed(async () => {
                    await StockSeed();
                });
            });
        });
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
