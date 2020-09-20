const express = require('express');
const { viewType } = require('../../middleware/router');
const access = require('../../middleware/access');
const { postValidation } = require('../../middleware/validations');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/posts');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/post/list'), access, all);
viewRouter.get('/add', viewType('admin/post/form'), access, add);
viewRouter.post('/add', postValidation, viewType('admin/post/form'), access, save);
viewRouter.get('/:id/edit', viewType('admin/post/form'), access, edit);
viewRouter.post('/:id/update', postValidation, viewType('admin/post/form'), access, update);
viewRouter.get('/:id/delete', viewType('admin/post/delete'), access, destroy);

apiRouter.get('/', viewType(), all);

module.exports = {
    viewRouter,
    apiRouter
};
