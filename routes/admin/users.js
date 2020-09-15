const express = require('express');
const access = require('../../middleware/access');
const { userValidation, profileValidation } = require('../../middleware/validations');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy, profile, updateProfile } = require('../../controllers/admin/users');
const multer = require('multer');
const directory = './public/uploads/users';
const upload = multer({ dest: directory });
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/user/list'), access, all);

viewRouter.get('/profile', viewType('admin/user/profile'), access, profile);
viewRouter.get('/profile/edit', viewType('admin/user/edit-profile'), access, profile);
viewRouter.post('/profile/edit',
                // profileValidation,
                upload.single('avatar_url'),
                viewType('admin/user/edit-profile'),
                access,
                updateProfile);

viewRouter.get('/add', viewType('admin/user/form'), access, add);
viewRouter.post('/add', userValidation, viewType('admin/user/form'), access, save);

viewRouter.get('/:id/edit', viewType('admin/user/form'), access, edit);
viewRouter.post('/:id/update', userValidation, viewType('admin/user/form'), access, update);
viewRouter.get('/:id/delete', viewType('admin/user/delete'), access, destroy);


apiRouter.get('/', viewType(), all);

module.exports = {
  viewRouter,
  apiRouter
};
