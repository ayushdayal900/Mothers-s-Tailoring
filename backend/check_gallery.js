const mongoose = require('mongoose');
const CMS = require('./models/CMS');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';

mongoose.connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' })
    .then(async () => {
        console.log('Connected to DB');
        try {
            const items = await CMS.find({ type: 'gallery' });
            console.log(`Found ${items.length} gallery items.`);
            items.forEach(t => {
                console.log(`ID: ${t._id}, Active: ${t.isActive}, Title: ${t.title}`);
            });
        } catch (e) {
            console.log(e);
        }
        mongoose.disconnect();
    })
    .catch(err => console.log(err));
