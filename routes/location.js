const express = require('express');
const { viewType } = require('../middleware/router');
const { getCountries, getStates, getCities } = require('../controllers/admin/location');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */

apiRouter.get('/countries', viewType(), getCountries);
apiRouter.get('/states', viewType(), getStates); // ?withCity = 1 => with cities
apiRouter.get('/cities', viewType(), getCities);// ?state_id => state id

module.exports = {
    viewRouter,
    apiRouter
};
