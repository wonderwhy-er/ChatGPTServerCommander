const admin = require('firebase-admin');

let db;
const initDB = (serviceAccount) => {
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
  // Implement the logic to generate a unique public ID
  return 'some-unique-string';
}

module.exports = {
  createAppInFirestore,
  initDB,
};
