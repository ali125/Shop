const express = require('express');
const { viewType } = require('../../middleware/router');
const { roleValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/roles');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/role/list'), all);
viewRouter.get('/add', viewType('admin/role/form'), add);
viewRouter.post('/add', roleValidation, viewType('admin/role/form'), save);
viewRouter.get('/:id/edit', viewType('admin/role/form'), edit);
viewRouter.post('/:id/update', roleValidation, viewType('admin/role/form'), update);
viewRouter.get('/:id/delete', viewType('admin/role/delete'), destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
