const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './config/serviceAccountKey.json';
const absolutePath = path.resolve(__dirname, '..', serviceAccountPath);

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccountJson) {
    try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
        console.log('✅ Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin from env:', error.message);
    }
} else if (fs.existsSync(absolutePath)) {
    try {
        const serviceAccount = require(absolutePath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
        console.log('✅ Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error.message);
    }
} else {
    console.warn(`⚠️ Firebase Service Account Key not found at ${absolutePath}. Authentication will not work.`);
}

module.exports = admin;
