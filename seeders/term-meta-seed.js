const Termmeta = require('../model/termmeta');

const Termmeta_Adults_Sizes_Seed = async term_id => {
    try {
        const term_metas = [
            await Termmeta.build({
                term_id,
                meta_key: 'xs',
                meta_value: 'XS',
            }),
            await Termmeta.build({
                term_id,
                meta_key: 's',
                meta_value: 'S',
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'm',
                meta_value: 'M',
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'l',
                meta_value: 'L',
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'xl',
                meta_value: 'XL',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '2xl',
                meta_value: 'XXL',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '3xl',
                meta_value: 'XXXL',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '4xl',
                meta_value: 'XXXXL',
            }),
        ];
        let done = 0;
        for (let i = 0; i < term_metas.length; i++) {
            await term_metas[i].save().then(()=>{
                done++;
                if(done === term_metas.length){
                    console.log('Finished term_metas meta sizes insert');
                }
            })
        }
    } catch (e) {
        console.log('TermMetaSeed Sizes Error: ', e);
    }
};
const Termmeta_Baby_Sizes_Seed = async term_id => {
    try {
        const term_metas = [
            await Termmeta.build({
                term_id,
                meta_key: '0',
                meta_value: '0',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '1',
                meta_value: '1',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '2',
                meta_value: '2',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '3',
                meta_value: '3',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '4',
                meta_value: '4',
            }),
            await Termmeta.build({
                term_id,
                meta_key: '5',
                meta_value: '5',
            })
        ];
        let done = 0;
        for (let i = 0; i < term_metas.length; i++) {
            await term_metas[i].save().then(()=>{
                done++;
                if(done === term_metas.length){
                    console.log('Finished term_metas meta sizes insert');
                }
            })
        }
    } catch (e) {
        console.log('TermMetaSeed Sizes Error: ', e);
    }
};

const Termmeta_Colors_Seed = async term_id => {
    try {
        const term_metas = [
            await Termmeta.build({
                term_id,
                meta_key: 'چندرنگ',
                meta_value: '#009688, #FFC107'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'سفید',
                meta_value: '#FFFFFF'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'مشکی',
                meta_value: '#333333'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'زرد',
                meta_value: '#FFEB3B'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'سبز',
                meta_value: '#8BC34A'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'آبی',
                meta_value: '#2196F3'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'قرمز',
                meta_value: '#f44336'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'نارنجی',
                meta_value: '#ffc107'
            }),
            await Termmeta.build({
                term_id,
                meta_key: 'طوسی',
                meta_value: '#90A4AE'
            })
        ];
        let done = 0;
        for (let i = 0; i < term_metas.length; i++) {
            await term_metas[i].save().then(()=>{
                done++;
                if(done === term_metas.length){
                    console.log('Finished term_metas meta sizes insert');
                }
            })
        }
    } catch (e) {
        console.log('TermMetaSeed Sizes Error: ', e);
    }
};

const Termmeta_Site_Info_Seed = async term_id => {
    try {
        const term_metas = [
            await Termmeta.build({
                term_id,
                meta_key: 'نام',
                meta_value: 'Shop',
            }),
        ];
        let done = 0;
        for (let i = 0; i < term_metas.length; i++) {
            await term_metas[i].save().then(()=>{
                done++;
                if(done === term_metas.length){
                    console.log('Finished term_metas meta sizes insert');
                }
            })
        }
    } catch (e) {
        console.log('TermMetaSeed Sizes Error: ', e);
    }
};

module.exports = {
    Termmeta_Adults_Sizes_Seed,
    Termmeta_Baby_Sizes_Seed,
    Termmeta_Colors_Seed,
    Termmeta_Site_Info_Seed
};
