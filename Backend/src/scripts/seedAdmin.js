import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'admin@clubinduction.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin already exists!');
            console.log('Email:', existingAdmin.email);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123456', 10);

        await User.insertMany([{
            fullName: 'Admin User',
            email: 'admin@clubinduction.com',
            password: hashedPassword,
            department: 'Administration',
            phone: '9999999999',
            rollNumber: 'ADMIN001',
            role: 'admin'
        }]);

        console.log('🎉 Admin created!');
        console.log('📧 Email: admin@clubinduction.com');
        console.log('🔑 Password: admin123456');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedAdmin();