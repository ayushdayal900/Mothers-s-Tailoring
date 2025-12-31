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
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(compression()); // Compress all responses
app.use(morgan('dev')); // Log requests

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health Check Endpoint (for Load Balancers)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// JSON Docs
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size

// Data Sanitization
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss()); // Prevent XSS
app.use(hpp()); // Prevent HTTP Param Pollution

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahalxmi_tailors';

mongoose.connect(MONGODB_URI, { dbName: 'Mahalaxmi_db' })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.send('Mother\'s Tailoring API is running...');
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
