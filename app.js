const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const app = express();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const indexRouter = require('./routes/index');

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// config express-session
var sess = {
  secret: 'fuck it',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true;
}

app.use(session(sess));

passport.serializeUser(function (user, done) {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  // Users.findById(obj, done);
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/', indexRouter);

module.exports = app;