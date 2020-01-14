const express = require('express');
var bodyParser = require('body-parser')
const db = require("./firebase-config");
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

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

app.get('/', (req, res) => {                                                     //обработка метода GET
  res.sendFile(path.resolve("./public/index.html"));
});

app.get('/users', (req, res) => {
  let users = [];
  db.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users);

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
  //let docRef = db.doc("users/Dan2")

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




module.exports = app;














































//-----------------------------------------------------------------------------

// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });



// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });




//add new document without a generated ID

// let dbDoc = 'PersonX';
// let docRef = db.collection('users').doc(dbDoc);
// //let docRef = db.doc("users/Dan2")

// let setAda = docRef.set({
//   first: 'Danushka',
//   last: 'Nuwan',
//   born: 0000
// }).then(function () {
//   console.log("saved");
// }).catch(function (error) {
//   console.log(error);
// });



// Add a new document with a generated id.  

// let addDoc = db.collection('users').add({
//   name: 'Tokyo',
//   country: 'Japan'
// }).then(ref => {
//   console.log('Added document with ID: ', ref.id);
// });


//get data using queries
// let usersRef = db.collection('users');
// let query = usersRef.where('name', '==', 'Tokyo').get()
//   .then(snapshot => {
//     if (snapshot.empty) {
//       console.log('No matching documents.');
//       return;
//     }

//     snapshot.forEach(doc => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });




