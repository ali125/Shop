const express = require('express');
const multer = require('multer');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/media');
const directory = './public/uploads/media';
const upload = multer({ dest: directory });
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/media/list'), all);
viewRouter.get('/add', viewType('admin/media/add'), add);
viewRouter.post('/add', upload.fields([{ name: 'file', maxCount: 10 }]), viewType('admin/media/add'), save);
viewRouter.get('/:id/edit', viewType('admin/media/edit'), edit);
viewRouter.post('/:id/update', viewType('admin/media/edit'), update);
viewRouter.get('/:id/delete', viewType('admin/media/delete'), destroy);

apiRouter.get('/', viewType(), all);
apiRouter.post('/add', upload.fields([{ name: 'file', maxCount: 1 }]), viewType(), save);

module.exports = {
  viewRouter,
  apiRouter
};
