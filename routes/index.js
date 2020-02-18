const express = require('express');
const passport = require('passport');
const db = require("../firebase-config");
const secured = require('../lib/middleware/secured');
const router = express.Router();

var username;
var loginErr;

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', secured(), async function (req, res) {
    if (username == undefined && req.user != undefined) {
      let dbDoc = req.user.emails[0].value;
      let docRef = db.collection('users').doc(dbDoc);
      let getDoc = docRef.get()
        .then(user => {
          if (!user.exists) {
            console.log('No such document!');
  
            let dbDoc = req.user.emails[0].value;
            let docRef = db.collection('users').doc(dbDoc);
  
            let setAda = docRef.set({
              name: req.user.displayName,
              password: req.user.id
            }).then(function () {
              console.log("saved");
              res.render('dashboard', { user: req.user.displayName});
            }).catch(function (error) {
              console.log(error);
            });
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
  
    } else if (username != undefined) {
      res.render('dashboard', { user: username });
    } else {
      res.redirect("/");
    }
  
  });
  
  
  router.get('/auth/google', passport.authenticate('google', {
    scope: ['openid email profile']
  }));
  
  
  router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
  }),
    function (req, res) {
      res.redirect('/dashboard');
    });

router.get('/users', (req, res) => {
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
  
  
  router.post('/users', function (req, res) {
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
  
  
  router.post('/login', function (req, res) {
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
  

module.exports = router;