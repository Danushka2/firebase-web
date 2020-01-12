//import 'firebase/firestore';
// import * as firebase from 'firebase';
// import 'firebase/firestore';

document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


    try {
      let app = firebase.app();
      console.log(app);
      let features = ['auth','firestore', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
      console.log(`Firebase SDK loaded with ${features.join(', ')}`);

      var firestore = firebase.firestore();

      const docRef = firestore.doc("users/person1")

      docRef.set({
        name: "Nw",
        password: "24",
        age: 21
      }).then(function(){
        console.log("saved");
      }).catch(function(error){
        console.log(error);
      });











    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }



  });