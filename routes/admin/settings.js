const express = require('express');
const { viewType } = require('../../middleware/router');
const settingsController= require('../../controllers/admin/settings/settings');
const termmetaController = require('../../controllers/admin/settings/termmeta');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/settings/index'), settingsController.all);

viewRouter.get('/add', viewType('admin/settings/add'), settingsController.add);
viewRouter.post('/add', viewType('admin/settings/add'), settingsController.save);
viewRouter.get('/:id/delete', viewType('admin/settings/add'), settingsController.destroy);

viewRouter.get('/product/:slug', viewType('admin/settings/termmeta'), termmetaController.all);
viewRouter.post('/product/:slug/add', viewType('admin/settings/termmeta'), termmetaController.save);
viewRouter.get('/product/:slug/:id/delete', viewType('admin/settings/termmeta'), termmetaController.destroy);


// viewRouter.get('/:id/edit', viewType('admin/settings/edit'), edit);
// viewRouter.post('/:id/update', viewType('admin/settings/edit'), update);
// viewRouter.get('/:id/delete', viewType('admin/settings/delete'), destroy);
// apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
