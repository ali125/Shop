const express = require('express');
const { adminOrderValidation } = require('../../middleware/validations');
const { viewType } = require('../../middleware/router');
const { all } = require('../../controllers/admin/order');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/order/list'), all);

// viewRouter.get('/add', viewType('admin/order/form'), add);
// viewRouter.post('/add', adminOrderValidation, viewType('admin/order/form'), save);
//
// viewRouter.get('/:id/edit', viewType('admin/order/form'), edit);
// viewRouter.post('/:id/update', adminOrderValidation, viewType('admin/order/form'), update);
// viewRouter.get('/:id/delete', viewType('admin/order/delete'), destroy);


apiRouter.get('/', viewType(), all);

module.exports = {
    viewRouter,
    apiRouter
};
