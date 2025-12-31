const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("Attempting to connect with URI length:", uri ? uri.length : "undefined");

mongoose.connect(uri, { dbName: 'Mahalaxmi_db' })
    .then(async () => {
        console.log("✅ Connected to MongoDB");

        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        console.log("Available Databases:", dbs.databases.map(d => d.name));

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in 'Mahalaxmi_db':", collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('products').countDocuments();
        console.log(`Count of documents in 'products' collection: ${count}`);

        const products = await mongoose.connection.db.collection('products').find({}).limit(1).toArray();
        console.log("Sample Product:", products);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error("❌ Connection Error:", err);
        process.exit(1);
    });
