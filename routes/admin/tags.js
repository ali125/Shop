const express = require('express');
const { viewType } = require('../../middleware/router');
const { tagValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/tags');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/tag/list'), all);
viewRouter.get('/add', viewType('admin/tag/form'), add);
viewRouter.post('/add', tagValidation, viewType('admin/tag/form'), save);
viewRouter.get('/:id/edit', viewType('admin/tag/form'), edit);
viewRouter.post('/:id/update', tagValidation, viewType('admin/tag/form'), update);
viewRouter.get('/:id/delete', viewType('admin/tag/delete'), destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
