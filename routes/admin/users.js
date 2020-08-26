const express = require('express');
const { userValidation } = require('../../middleware/validations');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/users');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/user/list'), all);
viewRouter.get('/add', viewType('admin/user/form'), add);
viewRouter.post('/add', userValidation, viewType('admin/user/form'), save);
viewRouter.get('/:id/edit', viewType('admin/user/form'), edit);
viewRouter.post('/:id/update', userValidation, viewType('admin/user/form'), update);
viewRouter.get('/:id/delete', viewType('admin/user/delete'), destroy);
viewRouter.get('/profile', (req, res, next) => {
  res.render('admin/user/profile');
});

apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
