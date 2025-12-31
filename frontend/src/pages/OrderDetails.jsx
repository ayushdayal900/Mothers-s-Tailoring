import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Truck, Package, ArrowLeft, MapPin } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Assuming we have an endpoint for single order. If not, we might need to fetch all and find (less ideal)
                // Ideally: GET /api/orders/:id. Checking orderRoutes... 
                // Based on previous knowledge, getOrderById is likely in controller but route param might be different.
                // Using standard REST pattern for now.
                const res = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
                console.log("Order Details API Response:", res.data);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="min-h-screen py-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-maroon"></div></div>;
    if (!order) return <div className="min-h-screen py-32 text-center text-gray-500">Order not found.</div>;

    // Timeline Logic
    const steps = [
        { status: 'pending', label: 'Order Placed', icon: Clock },
        { status: 'measurements_confirmed', label: 'Measurements Confirmed', icon: CheckCircle }, // Assuming this status exists or mapped
        { status: 'in_stitching', label: 'In Stitching', icon: Package },
        { status: 'ready', label: 'Ready', icon: CheckCircle },
        { status: 'dispatched', label: 'Dispatched', icon: Truck },
        { status: 'completed', label: 'Delivered', icon: CheckCircle }
    ];

    // Helper to determine step state: 'completed', 'current', 'upcoming'
    const getStepState = (stepStatus, currentStatus) => {
        const statusOrder = ['pending', 'measurements_confirmed', 'in_stitching', 'ready', 'dispatched', 'completed'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepStatus);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <Link to="/customer/orders" className="inline-flex items-center text-gray-500 hover:text-brand-maroon mb-6 transition">
                    <ArrowLeft size={18} className="mr-2" /> Back to Orders
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    {/* Header */}
                    <div className="bg-brand-ivory/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-brand-maroon">Order #{order.orderNumber}</h1>
                            <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">₹{order.totalAmount}</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-8 border-b border-gray-100 overflow-x-auto">
                        <div className="flex items-center justify-between min-w-[700px] relative">
                            {/* Connecting Line */}
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                            {steps.map((step, idx) => {
                                const state = getStepState(step.status, order.status);
                                const isCompleted = state === 'completed';
                                const isCurrent = state === 'current';

                                return (
                                    <div key={idx} className="flex flex-col items-center gap-3 relative bg-white px-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition z-10 
                                            ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                                                isCurrent ? 'bg-brand-maroon border-brand-maroon text-white animate-pulse' :
                                                    'bg-white border-gray-300 text-gray-300'}`}>
                                            <step.icon size={18} />
                                        </div>
                                        <p className={`text-sm font-medium ${isCurrent ? 'text-brand-maroon' : 'text-gray-500'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-8 p-8">
                        {/* Order Items */}
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Items</h3>
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {/* Display Product Image */}
                                        <img
                                            src={item.product?.images?.[0] || "https://via.placeholder.com/150"}
                                            alt={item.product?.name || "Product"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{item.product?.name || "Unknown Product"}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="font-medium text-brand-maroon mt-1">₹{item.totalPrice}</p>

                                        {/* Future: Display customization details if stored in orderItems */}
                                        {item.customization && (
                                            <div className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                                                Customizations: {JSON.stringify(item.customization)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping & Payment */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Delivery Address</h3>
                                <div className="flex items-start gap-3 text-gray-600">
                                    <MapPin className="mt-1 flex-shrink-0 text-brand-maroon" size={18} />
                                    <div className="text-sm leading-relaxed">
                                        <p className="font-medium text-gray-900">{order.deliveryAddress?.street}</p>
                                        <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                        <p>{order.deliveryAddress?.postalCode}</p>
                                        <p>{order.deliveryAddress?.country}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Payment Info</h3>
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex justify-between items-center text-sm font-medium">
                                    <span>Method</span>
                                    <span>{order.paymentMethod || 'Online'}</span>
                                </div>
                                <div className={`mt-2 p-4 rounded-lg flex justify-between items-center text-sm font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-700'}`}>
                                    <span>Status</span>
                                    <span className="capitalize">{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
