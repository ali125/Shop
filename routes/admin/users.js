const express = require('express');
const { userValidation, profileValidation } = require('../../middleware/validations');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy, profile, updateProfile } = require('../../controllers/admin/users');
const multer = require('multer');
const directory = './public/uploads/users';
const upload = multer({ dest: directory });
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/user/list'), all);

viewRouter.get('/profile', viewType('admin/user/profile'), profile);
viewRouter.get('/profile/edit', viewType('admin/user/edit-profile'), profile);
viewRouter.post('/profile/edit',
                // profileValidation,
                upload.single('avatar_url'),
                viewType('admin/user/edit-profile'),
                updateProfile);

viewRouter.get('/add', viewType('admin/user/form'), add);
viewRouter.post('/add', userValidation, viewType('admin/user/form'), save);

viewRouter.get('/:id/edit', viewType('admin/user/form'), edit);
viewRouter.post('/:id/update', userValidation, viewType('admin/user/form'), update);
viewRouter.get('/:id/delete', viewType('admin/user/delete'), destroy);


apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
