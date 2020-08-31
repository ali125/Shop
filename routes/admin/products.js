const express = require('express');
const { viewType } = require('../../middleware/router');
const { productValidation } = require('../../middleware/validations');
const { all, get, add, save, update, edit, destroy } = require('../../controllers/admin/products');
const multer = require('multer');
const directory = './public/uploads/products';
const upload = multer({ dest: directory });
const viewRouter = express.Router();
const apiRouter = express.Router();

viewRouter.get('/', viewType('admin/product/list'), all);
viewRouter.get('/add', viewType('admin/product/add'), add);
viewRouter.post('/add',
                productValidation,
                // upload.fields([{ name: 'media', maxCount: 8 }]),
                viewType('admin/product/add'),
                save);
viewRouter.get('/:id', viewType('admin/product/single'), get);
viewRouter.get('/:id/edit', viewType('admin/product/edit'), edit);
viewRouter.post('/:id/update',
                productValidation,
                viewType('admin/product/edit'),
                update);
viewRouter.get('/:id/delete', viewType('admin/product/delete'), destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
