const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['banner', 'testimonial', 'faq'],
        required: true
    },
    // Banner Fields
    title: String,
    imageUrl: String,
    link: String,

    // Testimonial Fields
    author: String,
    role: String, // e.g., "Bride", "Regular Customer"
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    content: String, // For both Testimonial quote and FAQ answer

    // FAQ Fields
    question: String,

    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CMS', cmsSchema);
