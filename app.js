const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./controllers/index');
const carsRouter = require('./controllers/cars');
const companiesRouter = require('./controllers/companies');
const usersRouter = require('./controllers/users');

const authRouter = require('./controllers/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//joing node modules
app.use(express.static(path.join(__dirname, "node_modules")));

//using dotenv package to read from .env file
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
//mongodb connection string
const mongoose = require('mongoose');
const { hasSubscribers } = require('diagnostics_channel');

mongoose.connect(process.env.CONNECTION_STRING).then((res) => {
  console.log('Connected to mongoose');
}).catch(() => {
  console.log('Connection to mongoose failed');
}
)

//passport authentication config
const passport = require('passport');
const session = require('express-session');

//initialize session 
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user')
passport.use(User.createStrategy())


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//google auth
const googleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  User.findOrCreate({ oauthId: profile.id }, {
    username: profile.displayName,
    oauthProvider: 'Google'
  }, (err, user) => {
    return done(err, user);
  })
}));

//facebook auth
const facebookStratergy = require("passport-facebook").Strategy;

passport.use(new facebookStratergy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  //'profileFields' not included in passport documentation
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
}, async(accessToken, refreshToken, profile, done) => {
  await User.findOrCreate({ oauthId: profile.id }, {
    username: profile.name.givenName,
    oauthProvider: 'Facebook'
  }, (err, user) => {
    return done(err, user);
  })
}));





app.use('/', indexRouter);
app.use('/cars', carsRouter)
app.use('/companies', companiesRouter)
app.use('/users', usersRouter);
app.use('/auth', authRouter);







//hbs function for select element value
const hbs = require('hbs');
const { profile } = require('console');
hbs.registerHelper('selectOption', (currentValue, selectedValue) => {
  let selectedProperty = '';
  if (currentValue == selectedValue) {
    selectedProperty = ' selected';
  }
  return new hbs.SafeString(`<option${selectedProperty}>${currentValue}</option>`);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
