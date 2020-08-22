let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let {verifyToken} = require("./mongo-models/AuthModel");

let publicRouter = require('./routes/public');
let apiRouter = require('./routes/api');
let accountRouter = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//authenticate editor
app.get('/edit', (req, res, next) => {
  if (verifyToken(req.cookies.jwt) == null)
    res.redirect('/login?redirect=/edit/');
  else next();
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/file', publicRouter);
app.use('/account', accountRouter);
app.use('/api', apiRouter);

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
  res.render('error');
});

module.exports = app;
