require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
// Mask password for safety in logs
const maskedUri = uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED';

console.log('---------------------------------------------------');
console.log('DEBUG: Testing MongoDB Connection');
console.log('DEBUG: URI (Masked):', maskedUri);
console.log('---------------------------------------------------');

if (!uri || uri.includes('<password>')) {
    console.error('❌ ERROR: MONGODB_URI is invalid or contains placeholders like <password>.');
    console.error('   Please update your .env file with the actual password.');
    process.exit(1);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB!');
        // Check if database is writable
        console.log('   Connection state:', mongoose.connection.readyState);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ CONNECTION FAILED');
        console.error('   Error Name:', err.name);
        console.error('   Error Message:', err.message);
        // console.error('   Full Details:', JSON.stringify(err, null, 2));
        process.exit(1);
    });
