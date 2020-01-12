const http = require('http');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");


//----------------------------------------------------------------------------
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World! \n from Danushka');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//-----------------------------------------------------------------------------


try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://testing-708e2.firebaseio.com"
  });

  const db = admin.firestore();
  
  db.collection('users').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data().name);
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
  
  


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
  let addDoc = db.collection('users').add({
    name: 'Tokyo',
    country: 'Japan'
  }).then(ref => {
    console.log('Added document with ID: ', ref.id);
  });



} catch (e) {
  console.error(e);
}

