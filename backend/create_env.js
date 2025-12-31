const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://admin:123@mahalaxmi-db-cluster.oscfdm5.mongodb.net/?appName=Mahalaxmi-db-cluster

# Frontend URL (For CORS)
FRONTEND_URL=http://localhost:5173

# JWT Secrets
JWT_SECRET=mahalaxmi_super_secret_key_dev

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');
console.log('✅ backend/.env created with UTF-8 encoding');
