const express = require('express');
const { viewType } = require('../../middleware/router');
const { categoryValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/categories');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/category/list'), all);
viewRouter.get('/add', viewType('admin/category/form'), add);
viewRouter.post('/add', categoryValidation , viewType('admin/category/form'), save);
viewRouter.get('/:id/edit', viewType('admin/category/form'), edit);
viewRouter.post('/:id/update', categoryValidation, viewType('admin/category/form'), update);
viewRouter.get('/:id/delete', viewType('admin/category/delete'), destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
