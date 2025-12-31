const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

/* ------------------ MongoDB Connection ------------------ */
const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';

mongoose
    .connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' })
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

/* ------------------ Categories ------------------ */
const categoriesData = [
    {
        name: 'Rajlaxmi',
        slug: 'rajlaxmi',
        description: 'Traditional Rajlaxmi stitching styles.',
        basePrice: 3500,
        displayOrder: 1,
    },
    {
        name: 'Peshwai',
        slug: 'peshwai',
        description: 'The authentic Peshwai style drape.',
        basePrice: 3200,
        displayOrder: 2,
    },
    {
        name: 'Mastani',
        slug: 'mastani',
        description: 'Modern fusion styles.',
        basePrice: 4000,
        displayOrder: 3,
    },
    {
        name: 'Normal Stitching',
        slug: 'normal',
        description: 'Standard blouse and kurti stitching.',
        basePrice: 850,
        displayOrder: 4,
    },
];

/* ------------------ Seeder Function ------------------ */
const seedDB = async () => {
    try {
        /* Clear old data */
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('🧹 Existing data cleared');

        /* Insert categories */
        const createdCategories = await Category.insertMany(categoriesData);

        /* Create slug → ObjectId map */
        const categoryMap = {};
        createdCategories.forEach((cat) => {
            categoryMap[cat.slug] = cat._id;
        });

        /* Products */
        const products = [
            {
                name: 'Royal Rajlaxmi Paithani',
                category: categoryMap.rajlaxmi,
                price: 3500,
                description:
                    'Traditional Rajlaxmi stitching with intricate border alignment.',
                fabricOptions: ['Silk', 'Semi-Silk'],
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
                        altText: 'Rajlaxmi Front View',
                    },
                ],
                rating: 4.8,
            },
            {
                name: 'Classic Peshwai Nauvari',
                category: categoryMap.peshwai,
                price: 3200,
                description:
                    'Authentic Peshwai Nauvari inspired by Maratha heritage.',
                fabricOptions: ['Cotton', 'Silk'],
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2',
                        altText: 'Peshwai View',
                    },
                ],
                rating: 4.9,
            },
            {
                name: 'Modern Mastani Drape',
                category: categoryMap.mastani,
                price: 4000,
                description:
                    'A fusion drape combining gown elegance with saree tradition.',
                fabricOptions: ['Chiffon', 'Georgette'],
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
                        altText: 'Mastani Style',
                    },
                ],
                rating: 4.7,
            },
            {
                name: 'Standard Blouse Stitching',
                category: categoryMap.normal,
                price: 850,
                description: 'Premium custom blouse stitching with lining.',
                fabricOptions: ['Cotton Lining', 'Satin Lining'],
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1',
                        altText: 'Blouse Work',
                    },
                ],
                rating: 4.5,
            },
        ];

        await Product.insertMany(products);
        console.log('🌱 Categories & Products seeded successfully');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

/* ------------------ Run Seeder ------------------ */
seedDB();
