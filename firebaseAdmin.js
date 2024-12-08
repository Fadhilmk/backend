import admin from "firebase-admin";

// Function to format the private key correctly
function formatPrivateKey(key) {
  return key.replace(/\\n/g, "\n");
}

// Function to create or return an existing Firebase Admin app
export function createFirebaseAdminApp(params) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    // Return existing app if already initialized
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

// Function to initialize the Firebase Admin app with environment variables
export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  return createFirebaseAdminApp(params);
}
