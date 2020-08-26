const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const sessionStore = require('./model/session');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin/index');

// PermissionRole.sync();
const csrfProtection = csrf({ cookie: true });

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'session secret',
    store: sessionStore,
    resave: false,
    proxy: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use('/', indexRouter.viewRouter);
app.use('/api', indexRouter.apiRouter);

app.use('/admin', adminRouter.viewRouter);
app.use('/api/admin', adminRouter.apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error1');
  // res.render('error');
});

module.exports = app;
