
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
    externalResources: externalResources || [],
    internalBlocks: internalBlocks || [],
    createdAt: admin.firestore.FieldValue.serverTimestamp() // Store creation timestamp
  };

  const docRef = await db.collection('Apps').add(newAppData);
  return { id: docRef.id, privateId: privateId };
};

function generatePrivateId() {
  // Returns a randomly generated private ID for app identification
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const getFirebaseAppByPublicId = async (publicId) => {
  try {
    const docRef = db.collection('Apps').doc(publicId);
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return null;
    }
    const { privateId, ...publicData } = doc.data();
    return publicData;
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
};

const getFirebaseAppByPrivateId = async (id) => {
  const querySnapshot = await db.collection('Apps').where('privateId', '==', id).get();
  if (querySnapshot.empty) {
    console.log('No matching documents.');
    return null;
  }
  const { privateId, ...publicData } = querySnapshot.docs[0].data();
  return publicData; // Excluding the private ID from the response
};

module.exports = {
  createAppInFirestore,
  initDB,
  getFirebaseAppByPublicId,
  getFirebaseAppByPrivateId
};