const http = require('http');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");


//---------------------------------------------------------------------------------------



try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://testing-708e2.firebaseio.com"
  });
} catch (e) {
  console.error(e);
}


const db = admin.firestore();



//----------------------------------------------------------------------------
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  var url = req.url;
  if (url === '/') {
    res.write(' Welcome Everyone');
    res.end();
  } else if (url === '/home') {
    res.write(' Welcome to home page');
    res.end();
  } else if (url === '/save') {
    res.write(' save users');
    res.end();
  } else if (url === '/users') {

    db.collection('users').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });


    res.write(' show users ');
    res.end();
  } else {
    res.write('404!');
    res.end();
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});





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




