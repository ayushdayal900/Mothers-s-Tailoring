const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Process Chat Message
// @route   POST /api/chatbot/message
// @access  Private (Auth required to know role)
exports.processMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user; // From auth middleware
        const role = user.role;

        let response = {
            text: "I didn't capture that. Could you try rephrasing?",
            action: null
        };

        const lowerMsg = message.toLowerCase();

        // --- ADMIN INTENTS ---
        if (role === 'admin') {

            // 1. Navigation: Dashboard
            if (lowerMsg.includes('dashboard') || lowerMsg.includes('home')) {
                return res.json({
                    text: "Navigating to Dashboard.",
                    action: { type: 'NAVIGATE', payload: '/admin/dashboard' }
                });
            }

            // 2. Navigation: CMS
            if (lowerMsg.includes('cms') || lowerMsg.includes('content') || lowerMsg.includes('banner')) {
                return res.json({
                    text: "Opening Content Management System.",
                    action: { type: 'NAVIGATE', payload: '/admin/cms' }
                });
            }

            // 3. Navigation: Orders
            if (lowerMsg.includes('order') && !lowerMsg.includes('pending')) {
                return res.json({
                    text: "Taking you to order management.",
                    action: { type: 'NAVIGATE', payload: '/admin/orders' }
                });
            }

            // 4. Data: Pending Orders
            if (lowerMsg.includes('pending order')) {
                const count = await Order.countDocuments({ status: 'pending' });
                return res.json({
                    text: `You have ${count} pending orders waiting for action.`,
                    action: { type: 'NAVIGATE', payload: '/admin/orders' } // Navigate to see them
                });
            }

            // 5. Data: Total Sales
            if (lowerMsg.includes('sales') || lowerMsg.includes('revenue')) {
                // Simplified aggression for quick chat response
                const paidOrders = await Order.find({ paymentStatus: 'paid' });
                const total = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
                return res.json({
                    text: `Total Revenue recorded is ₹${total.toLocaleString()}.`,
                    action: { type: 'NAVIGATE', payload: '/admin/payments' }
                });
            }
        }

        // --- CUSTOMER INTENTS ---
        if (role === 'customer') {

            // 1. Shopping: Add to Cart (Regex: "add 2 paithani", "buy paithani", "add 1 of that")
            // Patterns: 
            // - add/buy <number> <item>
            // - add/buy <item> (implies 1)
            const quantityMatch = lowerMsg.match(/(?:add|buy)\s+(\d+)\s+(.*)/);
            const simpleMatch = lowerMsg.match(/(?:add|buy)\s+(.*)/);

            if (quantityMatch || simpleMatch) {
                let quantity = 1;
                let keyword = '';

                if (quantityMatch) {
                    quantity = parseInt(quantityMatch[1]);
                    keyword = quantityMatch[2].trim();
                } else if (simpleMatch) {
                    // Filter out numbers if they didn't match the first regex just in case
                    keyword = simpleMatch[1].replace(/\b\d+\b/g, '').trim();
                }

                // If user just says "buy" or "add" without item
                if (!keyword) {
                    return res.json({
                        text: "What would you like to buy?",
                        suggestions: [
                            { label: 'Paithani', cmd: 'Buy Paithani' },
                            { label: 'Peshwai', cmd: 'Buy Peshwai' }
                        ]
                    });
                }

                // Find product (fuzzy search)
                const product = await Product.findOne({
                    name: { $regex: keyword, $options: 'i' }
                });

                if (product) {
                    return res.json({
                        text: `Found "${product.name}". Adding ${quantity} to your cart.`,
                        action: {
                            type: 'ADD_TO_CART',
                            payload: { product, quantity }
                        },
                        suggestions: [
                            { label: 'Checkout Now', cmd: 'Proceed to checkout' },
                            { label: 'View Cart', cmd: 'Go to cart' },
                            { label: 'Keep Shopping', cmd: 'Show me designs' }
                        ]
                    });
                } else {
                    return res.json({
                        text: `I couldn't find a product matching "${keyword}".`,
                        action: { type: 'NAVIGATE', payload: '/designs' },
                        suggestions: [
                            { label: 'Browse All Designs', cmd: 'Go to designs' }
                        ]
                    });
                }
            }

            // 2. Navigation: Designs/Shop
            if (lowerMsg.includes('shop') || lowerMsg.includes('design') || (lowerMsg.includes('show') && lowerMsg.includes('saree'))) {
                return res.json({
                    text: "Browsing our latest collection.",
                    action: { type: 'NAVIGATE', payload: '/designs' },
                    suggestions: [
                        { label: 'Filter by Price', cmd: 'Show affordable sarees' },
                        { label: 'New Arrivals', cmd: 'Sort by newest' }
                    ]
                });
            }

            // 3. Navigation: My Orders
            if (lowerMsg.includes('my order') || lowerMsg.includes('status') || lowerMsg.includes('track')) {
                return res.json({
                    text: "Here are your recent orders.",
                    action: { type: 'NAVIGATE', payload: '/customer/orders' }, // Fixed path
                    suggestions: [
                        { label: 'Contact Support', cmd: 'Contact store' },
                        { label: 'Shop Again', cmd: 'Go to designs' }
                    ]
                });
            }

            // 4. Cart / Checkout
            if (lowerMsg.includes('cart') || lowerMsg.includes('checkout')) {
                return res.json({
                    text: "Opening your cart.",
                    action: { type: 'NAVIGATE', payload: '/cart' },
                    suggestions: [
                        { label: 'Checkout', cmd: 'Proceed to checkout' }
                    ]
                });
            }

            // 5. Navigation: Contact
            if (lowerMsg.includes('contact') || lowerMsg.includes('call') || lowerMsg.includes('store')) {
                return res.json({
                    text: "You can reach us at our Mangrulpir store or call us.",
                    action: { type: 'NAVIGATE', payload: '/contact' }
                });
            }
        }

        // Default Fallback
        res.json({
            text: "I'm not sure how to help with that yet. Try asking to 'Show designs' or 'My orders'.",
            action: null
        });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ text: "Sorry, I encountered an error processing your request." });
    }
};
