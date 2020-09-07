const express = require('express');
const { viewType } = require('../../middleware/router');
const { permissionValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/permissions');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/permission/list'), all);
viewRouter.get('/add', viewType('admin/permission/form'), add);
viewRouter.post('/add', permissionValidation, viewType('admin/permission/form'), save);
viewRouter.get('/:id/edit', viewType('admin/permission/form'), edit);
viewRouter.post('/:id/update', permissionValidation, viewType('admin/permission/form'), update);
viewRouter.get('/:id/delete', viewType('admin/permission/delete'), destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
