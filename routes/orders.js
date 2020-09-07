const express = require('express');
const { viewType } = require('../middleware/router');
const { getInfo, save } = require('../controllers/admin/order');
const viewRouter = express.Router();
const apiRouter = express.Router();


/* GET users listing. */
viewRouter.get('/information', viewType('admin/orders/information'), getInfo);
viewRouter.post('/create', viewType('admin/orders/create'), save);

module.exports = {
  viewRouter,
  apiRouter
};
