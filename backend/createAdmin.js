const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';
        await mongoose.connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' });
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'password123';

        const userExists = await User.findOne({ email: adminEmail });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (userExists) {
            console.log('⚠️ Admin user already exists. Updating password...');
            userExists.firstName = 'Admin';
            userExists.lastName = 'User';
            userExists.password = hashedPassword;
            await userExists.save();
            console.log('✅ Admin credentials updated!');
            console.log('-----------------------------------');
            console.log(`Email:    ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('-----------------------------------');
            process.exit(0);
        }

        await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('🎉 Admin User Created Successfully!');
        console.log('-----------------------------------');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
