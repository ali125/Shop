const Category = require('../model/category');

const CategorySeed = async () => {
    try {
        const categories = [
            await Category.build({
                name: 'لوازم الکترونیکی',
                slug: 'لوازم-الکترونیکی'
            }),
            await Category.build({
                name: 'لوازم خانگی',
                slug: 'لوازم-خانگی'
            }),
            await Category.build({
                name: 'لوازم جانبی',
                slug: 'لوازم-جانبی'
            }),
        ];
        let done = 0;
        for (let i = 0; i < categories.length; i++) {
            await categories[i].save().then(()=>{
                done++;
                if(done === categories.length){
                    console.log('Finished categories insert');
                    // sequelize.close();
                }
            })
        }
    } catch (e) {
        console.log('CategorySeed Error: ', e);
    }
};

module.exports = CategorySeed;
