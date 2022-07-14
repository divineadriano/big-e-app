var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var usersRouter = require('./routes/users');
var nodemailer = require('nodemailer');
var axios = require('axios');


var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'divinegraceguballa@gmail.com',
        pass: 'dDgPNS@041621'
    }
  });
 
var app = express();
 
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({ 
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
app.use(flash());
app.use('/', usersRouter);
app.use('/list', usersRouter);
app.use('/quote-portal', usersRouter);
 
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
 

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log('Server is running on port ${PORT}')
})
module.exports = app;