const express = require('express');
const { viewType } = require('../middleware/router');
const { getInfo, get, save, remove, destroy } = require('../controllers/admin/order');
const viewRouter = express.Router();
const apiRouter = express.Router();


/* GET users listing. */
viewRouter.get('/', viewType('admin/cart/list'), get);
viewRouter.get('/information', viewType('admin/orders/information'), getInfo);
viewRouter.post('/:id/add', viewType('admin/category/add'), save);
viewRouter.post('/:id/remove', viewType('admin/category/add'), remove);
viewRouter.get('/:id/delete', viewType('admin/category/delete'), destroy);

apiRouter.post('/:id/add', viewType(), save);
apiRouter.post('/:id/remove', viewType(), remove);

module.exports = {
  viewRouter,
  apiRouter
};
