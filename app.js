const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const db = require("./firebase-config");
const path = require('path');
const app = express();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var username;
var loginErr;
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
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

//----------------------------------------------------------------------
passport.serializeUser(function (user, done) {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  // Users.findById(obj, done);
  done(null, obj);
});

//------------------------------------------------------------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
  // console.log("3");
  // console.log(profile.displayName);
  // console.log(profile.emails[0].value);
  // console.log(profile.id);
  return done(null, profile);
}
));

app.use(passport.initialize());
app.use(passport.session());

//-------------------------------------------------------------------------------------


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


app.get('/', function (req, res) {
  res.render('index', { loginErr: loginErr });
});


app.get('/dashboard', ensureAuthenticated, async function (req, res) {
  if (username == undefined && req.user != undefined) {
    let dbDoc = req.user.emails[0].value;
    let docRef = db.collection('users').doc(dbDoc);
    let getDoc = docRef.get()
      .then(user => {
        if (!user.exists) {
          console.log('No such document!');
          loginErr = "Not a User.Please Sign Up!";
          res.redirect("/");
        }
        else {
          if (user.data().password == req.user.id) {
            console.log("Password matched");
            loginErr = "";
            username = user.data().name;
            res.render('dashboard', { user: username });
          }
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
      
  }else if(username != undefined){
    res.render('dashboard', { user: username });
  }else{
    res.redirect("/");
  }



  // if (username == undefined) {
  //   res.redirect("/");
  // } else {
  //   res.render('dashboard', { user: username });
  // }



});

















app.get('/auth/google', passport.authenticate('google', {
  scope: ['openid email profile']
}));


app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}),
  function (req, res) {
    console.log("1");
    res.redirect('/dashboard');
  });


app.get('/users', (req, res) => {
  let users = [];
  db.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      res.status(200).json({
        message: 'Post fetched successfully!',
        users: users
      });

    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
});


app.post('/users', function (req, res) {
  let dbDoc = req.body.emailF;
  let docRef = db.collection('users').doc(dbDoc);

  let setAda = docRef.set({
    name: req.body.nameF,
    password: req.body.passwordF
  }).then(function () {
    console.log("saved");
    res.redirect('/');
  }).catch(function (error) {
    console.log(error);
  });
});


app.post('/login', function (req, res) {
  let dbDoc = req.body.emailL;
  let docRef = db.collection('users').doc(dbDoc);

  let getDoc = docRef.get()
    .then(user => {
      if (!user.exists) {
        console.log('No such document!');
      } else {
        if (req.body.passwordL == user.data().password) {
          console.log("Password matched");
          username = user.data().name;
          res.redirect('/dashboard');
        }
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});


function ensureAuthenticated(req, res, next) {
  if (username != undefined) {
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}



module.exports = app;