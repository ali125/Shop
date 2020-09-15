const express = require('express');
const { viewType } = require('../../middleware/router');
const auth = require('../../middleware/auth');
const access = require('../../middleware/access');
const viewRouter = express.Router();
const apiRouter = express.Router();
const adminAuthController = require('../../controllers/admin/auth');
const adminPermissionsRouter = require('./permissions');
const adminRolesRouter = require('./roles');
const adminUsersRouter = require('./users');
const adminAddressesRouter = require('./addresses');
const adminProductsRouter = require('./products');
const adminTagsRouter = require('./tags');
const adminCategoriesRouter = require('./categories');
const adminMediaRouter = require('./media');
const adminSettingsRouter = require('./settings');
const adminOrdersRouter = require('./orders');

/* GET home page. */
viewRouter.get('/login', (req, res, next) => {
  res.render('admin/auth/login', { title: 'Login' });
});
viewRouter.post('/login', viewType('admin/auth/login'), adminAuthController.login);
viewRouter.post('/logout', viewType('admin/auth/login'), adminAuthController.logout);

viewRouter.get('/', auth, (req, res, next) => {
  res.render('admin/index', { title: 'Dashboard' });
});

viewRouter.use('/permissions', auth, adminPermissionsRouter.viewRouter);
viewRouter.use('/roles', auth, adminRolesRouter.viewRouter);
viewRouter.use('/users', auth, adminUsersRouter.viewRouter);
viewRouter.use('/test/:id/:role/edit', access);
viewRouter.use('/addresses', auth, adminAddressesRouter.viewRouter);
viewRouter.use('/products', auth, adminProductsRouter.viewRouter);
viewRouter.use('/tags', auth, adminTagsRouter.viewRouter);
viewRouter.use('/categories', auth, adminCategoriesRouter.viewRouter);
viewRouter.use('/media', auth, adminMediaRouter.viewRouter);
viewRouter.use('/settings', auth, adminSettingsRouter.viewRouter);
viewRouter.use('/orders', auth, adminOrdersRouter.viewRouter);

apiRouter.use('/media', adminMediaRouter.apiRouter);
apiRouter.use('/users', adminUsersRouter.apiRouter);

module.exports = {
  viewRouter,
  apiRouter
};
