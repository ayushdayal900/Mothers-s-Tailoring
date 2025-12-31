const mongoose = require('mongoose');
const CMS = require('./models/CMS');
require('dotenv').config();

const testimonials = [
    { author: "Priya D.", role: "Bride", content: "The Paithani stitching was flawless. It made my wedding day perfect!", rating: 5 },
    { author: "Anjali K.", role: "Regular Customer", content: "Authentic designs that fit perfectly every single time.", rating: 5 },
    { author: "Sneha M.", role: "Festive Wear", content: "The Mastani fusion gown was the highlight of the evening.", rating: 5 },
    { author: "Radha P.", role: "Saree Lover", content: "Best blouse fitting I have ever found in the city.", rating: 5 },
    { author: "Meera S.", role: "Designer", content: "They brought my sketch to life exactly how I imagined it.", rating: 5 },
    { author: "Kavita R.", role: "Corporate", content: "Excellent formal wear alterations. Very professional.", rating: 5 },
    { author: "Vidya N.", role: "Regular", content: "My go-to place for all stitching needs for 10 years.", rating: 5 },
    { author: "Pooja L.", role: "Bride's Sister", content: "The ghagra choli was stunning and comfortable for dancing.", rating: 5 },
    { author: "Lakshmi T.", role: "Traditional", content: "Preserved my grandmother's old saree with a beautiful new styling.", rating: 5 },
    { author: "Riya J.", role: "Modern Fusion", content: "Loved the crop top design from my old silk saree.", rating: 5 }
];

const seedTestimonials = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';
        await mongoose.connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' });
        console.log('✅ Connected to MongoDB');

        // Clear existing testimonials to avoid duplicates if re-run (optional, but safe for dev)
        // await CMS.deleteMany({ type: 'testimonial' });
        // console.log('🗑️ Cleared existing testimonials');

        const testimonialDocs = testimonials.map(t => ({
            type: 'testimonial',
            title: 'Customer Review', // Optional
            ...t,
            isActive: true
        }));

        await CMS.insertMany(testimonialDocs);
        console.log(`✅ Successfully added ${testimonials.length} testimonials!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding testimonials:', error);
        process.exit(1);
    }
};

seedTestimonials();
