const express = require('express');
const { viewType } = require('../../middleware/router');
const access = require('../../middleware/access');
const { permissionValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/permissions');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/permission/list'), access, all);
viewRouter.get('/add', viewType('admin/permission/form'), add);
viewRouter.post('/add', permissionValidation, viewType('admin/permission/form'), access, save);
viewRouter.get('/:id/edit', viewType('admin/permission/form'), access, edit);
viewRouter.post('/:id/update', permissionValidation, viewType('admin/permission/form'), access, update);
viewRouter.get('/:id/delete', viewType('admin/permission/delete'), access, destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
