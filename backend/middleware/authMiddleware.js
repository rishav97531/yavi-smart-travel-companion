const admin = require('../config/firebase');

const protect = async (req, res, next) => {
    let token;

    // Log initialized project ID only once to help debugging
    if (admin.apps.length > 0 && !global.firebaseProjectLogged) {
        console.log(`✅ Auth middleware using Firebase Project: ${admin.app().options.credential.projectId || 'Unknown'}`);
        global.firebaseProjectLogged = true;
    }

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify Firebase ID Token
            if (!admin.apps.length) {
                return res.status(503).json({ message: 'Authentication service unavailable.' });
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = decodedToken;
            return next();
        } catch (error) {
            console.error('❌ Firebase Auth Error:', error.message);
            
            // Helpful debugging for project ID mismatches
            if (error.code === 'auth/argument-error' || error.message.includes('project-id')) {
                console.warn('🚨 Project ID mismatch! Check if frontend and backend use the same Firebase Project.');
                console.warn(`Expected: ${admin.app().options.credential.projectId || 'Unknown'}, Token potentially from another project.`);
            } else if (error.code === 'auth/id-token-expired') {
                console.warn('⏰ Token expired. Frontend should refresh.');
            }

            return res.status(401).json({
                message: 'Authentication failed.',
                reason: error.code || 'unknown',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = { protect };
