const Product = require('../model/product');

const ProductSeed = async (cb) => {
    try{
        const products = [
            await Product.build({
                title: 'Mobile Samsung A720',
                slug: 'samsung-a720',
                content: 'Content Of Mobile Samsung A720 in seeder',
                user_id: 2,
                status: 1
            })
        ];
        let done = 0;
        for (let i = 0; i < products.length; i++) {
            await products[i].save().then(()=>{
                done++;
                if(done === products.length){
                    console.log('Finished product insert');
                    cb();
                }
            })
        }
    } catch (e) {
        console.log('ProductSeed Error: ', e);
    }
};

module.exports = ProductSeed;
