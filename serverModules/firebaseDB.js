
const admin = require('firebase-admin');
let serviceAccount;
try {
  serviceAccount = require('../firebaseAdmin.json');
} catch(e) {
  //console.error(e);
}

let db;
const initDB = () => {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
  }
}


const createAppInFirestore = async (appData) => {
  const { name, description, headHtml, bodyHtml } = appData;
  const privateId = generatePrivateId();

  const newAppData = {
    privateId: privateId,
    name,
    description,
    headHtml: headHtml || '',
    bodyHtml: bodyHtml || '',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
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