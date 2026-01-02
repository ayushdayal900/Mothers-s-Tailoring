import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Allow cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/logout') && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const res = await api.get('/auth/refresh');
                const newAccessToken = res.data.token;

                // Update default header
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - User must login again
                document.dispatchEvent(new Event('auth:logout'));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// Get Single Product by ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Measurements API
export const getMeasurements = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get('/measurements', config);
    return response.data;
};

export const updateMeasurements = async (data, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/measurements', data, config);
    return response.data;
};

// Wishlist API
export const getWishlist = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get('/wishlist', config);
    return response.data;
};

export const toggleWishlist = async (productId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/wishlist/toggle', { productId }, config);
    return response.data;
};

// Reviews API
export const addReview = async (data, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post('/reviews', data, config);
    return response.data;
};

export const getProductReviews = async (productId) => {
    const response = await api.get(`/reviews/${productId}`);
    return response.data;
};

export default api;
