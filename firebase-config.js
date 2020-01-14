const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://testing-708e2.firebaseio.com"
    });
  } catch (e) {
    console.error(e);
  }
  
  
  const db = admin.firestore();

module.exports = db;