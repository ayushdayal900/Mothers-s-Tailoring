const Wishlist = require('../models/wishlistModel');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add or Remove product from wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        const index = wishlist.products.indexOf(productId);

        if (index > -1) {
            // Retrieve - Remove
            wishlist.products.splice(index, 1);
            await wishlist.save();
            return res.status(200).json({ message: 'Removed from wishlist', wishlist });
        } else {
            // Add
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ message: 'Added to wishlist', wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    toggleWishlist
};
