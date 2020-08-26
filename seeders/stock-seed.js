const Term = require('../model/term');
const Termmeta = require('../model/termmeta');
const Product = require('../model/product');
const Stock = require('../model/stock');

const StockSeed = async () => {
    try{
        const product = await Product.findOne();
        const termColors = await Term.findOne({
            where: { slug: 'colors' },
            include: [Termmeta]
        });
        await Stock.sync();
        const stocks = [
            await Stock.build({
                price: 12000000,
                count: 1,
                product_id: product.id,
                user_id: 1
            })
        ];

        let done = 0;
        for (let i = 0; i < stocks.length; i++) {
            await stocks[i].save().then(async stock=>{
                done++;
                await stock.addTermmeta([
                    termColors.termmeta[0].id,
                    termColors.termmeta[1].id,
                    termColors.termmeta[2].id,
                ]);
                if(done === stocks.length){
                    console.log('Finished stock insert');
                }
            })
        }
    } catch (e) {
        console.log('StockSeed Error: ', e);
    }
};

module.exports = StockSeed;
