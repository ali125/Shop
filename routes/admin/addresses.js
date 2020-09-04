const express = require('express');
const { addressValidation } = require('../../middleware/validations');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/address');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/address/list'), all);

viewRouter.get('/add', viewType('admin/address/form'), add);
viewRouter.post('/add', addressValidation, viewType('admin/address/form'), save);

viewRouter.get('/:id/edit', viewType('admin/address/form'), edit);
viewRouter.post('/:id/update', addressValidation, viewType('admin/address/form'), update);
viewRouter.get('/:id/delete', viewType('admin/address/delete'), destroy);


apiRouter.get('/', viewType(), all);

module.exports = {
    viewRouter,
    apiRouter
};
