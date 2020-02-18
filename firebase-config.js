const dotenv = require('dotenv');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

dotenv.config();

try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } catch (e) {
    console.error(e);
  }
  
  
  const db = admin.firestore();

module.exports = db;