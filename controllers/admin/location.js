const Location = require('../../model/location');
const { renderView, renderViewError } = require('../../middleware/router');

exports.getCountries = async (req, res, next) => {
    try {
        const data = await Location.findAll({
            where: { country_id: null }
        });
        renderView(req, res, {
            title: 'لیست کشورها',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.getStates = async (req, res, next) => {
    try {
        const withCities = req.query.withCity && req.query.withCity.toString() === "1";
        const data = await Location.findAll({
            where: { country_id: 1 },
            include: withCities ? [{
                model: Location,
                as: 'cities'
            }] : []
        });
        renderView(req, res, {
            title: 'لیست استان ها',
            data
        });
    } catch(e) {
        console.log(e);
        renderViewError(req, res, {
            errors: e
        });
    }
};
exports.getCities = async (req, res, next) => {
    try {
        const state_id = req.query.state_id | 0;
        const data = await Location.findAll({
            where: { state_id }
        });
        renderView(req, res, {
            title: 'لیست شهرها',
            data
        });
    } catch(e) {
        renderViewError(req, res, {
            errors: e
        });
    }
};

