const express = require('express');
const cartsRouter = require('./carts');
const ordersRouter = require('./orders');
const locationsRouter = require('./location');
const auth = require('../middleware/auth');
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET home page. */
viewRouter.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// viewRouter.get('/test-email', (req, res, next) => {
//   sendMail({
//     to: 'ali.mortazavi977@gmail.com',
//     subject: 'text again',
//     html: '<p>Only other test</p>',
//     text: 'Only other test'
//   }, (err, resp) => {
//     if (err) {
//       return res.send(err);
//     }
//     return res.send(resp);
//   });
// });

viewRouter.use('/carts', auth, cartsRouter.viewRouter);
apiRouter.use('/carts', auth, cartsRouter.apiRouter);

viewRouter.use('/orders', auth, ordersRouter.viewRouter);
apiRouter.use('/orders', auth, ordersRouter.apiRouter);

viewRouter.use('/locations', locationsRouter.viewRouter);
apiRouter.use('/locations', locationsRouter.apiRouter);


module.exports = {
  viewRouter,
  apiRouter
};
