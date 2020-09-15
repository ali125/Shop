const express = require('express');
const { viewType } = require('../../middleware/router');
const access = require('../../middleware/access');
const { tagValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/tags');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/tag/list'), access, all);
viewRouter.get('/add', viewType('admin/tag/form'), access, add);
viewRouter.post('/add', tagValidation, viewType('admin/tag/form'), access, save);
viewRouter.get('/:id/edit', viewType('admin/tag/form'), access, edit);
viewRouter.post('/:id/update', tagValidation, viewType('admin/tag/form'), access, update);
viewRouter.get('/:id/delete', viewType('admin/tag/delete'), access, destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
