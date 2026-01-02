const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan'); // Request Logging
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Required for Render/Heroku deployment
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.cloudinary.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
        }
    }
}));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'https://mahalaxmi-tailoring.vercel.app', // Vercel App
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true // Allow cookies
}));
app.use(compression()); // Compress all responses
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev')); // Log requests

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000 // limit each IP to 5000 requests per windowMs - Increased for dev
});
app.use('/api', limiter);

// Data Sanitization
// app.use(mongoSanitize()); // Prevent NoSQL injection - Causing TypeError with req.query
// app.use(xss()); // Prevent XSS - Causing TypeError with req.query
// app.use(hpp()); // Prevent HTTP Param Pollution - Potentially causing issues

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';

mongoose.connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
const cmsRoutes = require('./routes/cmsRoutes');
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/cms', cmsRoutes);
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin/cloudinary', require('./routes/cloudinaryRoutes'));
app.use('/api/measurements', require('./routes/measurementRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/', (req, res) => {
    res.send('Mahalaxmi Tailoring API is running...');
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
