const Tag = require('../model/tag');

const TagSeed = async () => {
    try {
        const tags = [
            await Tag.build({
                title: 'لوازم الکترونیکی',
                slug: 'لوازم-الکترونیکی'
            }),
            await Tag.build({
                title: 'لوازم خانگی',
                slug: 'لوازم-خانگی'
            }),
            await Tag.build({
                title: 'لوازم جانبی',
                slug: 'لوازم-جانبی'
            }),
        ];
        let done = 0;
        for (let i = 0; i < tags.length; i++) {
            await tags[i].save().then(()=>{
                done++;
                if(done === tags.length){
                    console.log('Finished tags insert');
                    // sequelize.close();
                }
            })
        }
    } catch (e) {
        console.log('TagSeed Error: ', e);
    }
};

module.exports = TagSeed;
