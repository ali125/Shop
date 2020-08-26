const Term = require('../model/term');
const {
    Termmeta_Adults_Sizes_Seed,
    Termmeta_Baby_Sizes_Seed,
    Termmeta_Colors_Seed,
    Termmeta_Site_Info_Seed
} = require('./term-meta-seed');

const TermSizeChildSeed = async parent_id => {
    try {
        const terms = [
            await Term.build({
                title: 'بزرگسال',
                slug: 'adults',
                parent_id
            }),
            await Term.build({
                title: 'نوزاد',
                slug: 'babies',
                parent_id
            })
        ];
        let done = 0;
        for (let i = 0; i < terms.length; i++) {
            await terms[i].save().then(async term =>{
                if(i === 0) await Termmeta_Adults_Sizes_Seed(term.id);
                if(i === 1) await Termmeta_Baby_Sizes_Seed(term.id);
                done++;
                if(done === terms.length){
                    console.log('Finished terms insert');
                }
            })
        }
    } catch (e) {
        console.log('TermSeed Error: ', e);
    }
};

const TermChildSeed = async parent_id => {
    try {
        const terms = [
            await Term.build({
                title: 'سایز',
                slug: 'sizes',
                parent_id
            }),
            await Term.build({
                title: 'رنگ',
                slug: 'colors',
                type: 'color',
                parent_id
            }),
        ];
        let done = 0;
        for (let i = 0; i < terms.length; i++) {
            await terms[i].save().then(async term =>{
                if(i === 0) await TermSizeChildSeed(term.id);
                if(i === 1) await Termmeta_Colors_Seed(term.id);
                done++;
                if(done === terms.length){
                    console.log('Finished terms insert');
                }
            })
        }
    } catch (e) {
        console.log('TermSeed Error: ', e);
    }
};

const TermSeed = async () => {
    try {
        const terms = [
            await Term.build({
                title: 'اطلاعات سایت',
                slug: 'site',
            }),
            await Term.build({
                title: 'مشخصات محصول',
                slug: 'product-specifications',
            }),

        ];
        let done = 0;
        for (let i = 0; i < terms.length; i++) {
            await terms[i].save().then(async term=>{
                if(i === 0) await Termmeta_Site_Info_Seed(term.id);
                if(i === 1) await TermChildSeed(term.id);
                done++;
                if(done === terms.length){
                    console.log('Finished terms insert');
                    // sequelize.close();
                }
            });
        }

    } catch (e) {
        console.log('TermSeed Error: ', e);
    }
};

module.exports = TermSeed;
