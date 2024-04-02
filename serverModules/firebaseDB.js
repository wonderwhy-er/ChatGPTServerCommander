const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdmin.json');

let db;
const initDB = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
}

const createAppInFirestore = async (appData) => {
  const { name, description, externalResources, internalBlocks } = appData;
  const privateId = generatePrivateId(); // Implement this function based on your requirements.

  const newAppData = {
    privateId: privateId,
    name,
    description,
    externalResources,
    internalBlocks,
    createdAt: admin.firestore.FieldValue.serverTimestamp() // Store creation timestamp
  };

  const docRef = await db.collection('Apps').add(newAppData);
  return { id: docRef.id, privateId: privateId };
};

function generatePrivateId() {
  // Returns a randomly generated private ID for app identification
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
  createAppInFirestore,
  initDB,
};
