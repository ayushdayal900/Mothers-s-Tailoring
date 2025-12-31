import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Layout, MessageSquare, HelpCircle, Image as ImageIcon, Plus, Trash2, Edit2, X, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminCMS = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const { token } = useContext(AuthContext);

    // Initial Form State
    const [formData, setFormData] = useState({
        type: 'banner',
        title: '',
        imageUrl: '',
        link: '',
        author: '',
        role: '',
        rating: 5,
        content: '',
        question: '',
        order: 0,
        isActive: true
    });

    const resetForm = () => {
        setFormData({
            type: activeTab === 'banners' ? 'banner' : activeTab === 'testimonials' ? 'testimonial' : 'faq',
            title: '',
            imageUrl: '',
            link: '',
            author: '',
            role: '',
            rating: 5,
            content: '',
            question: '',
            order: 0,
            isActive: true
        });
        setCurrentItem(null);
        setIsEditing(false);
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const endpointType = activeTab === 'banners' ? 'banner' : activeTab === 'testimonials' ? 'testimonial' : 'faq';
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/cms/admin/${endpointType}`, config);
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/cms/${id}`, config);
            fetchItems();
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...formData, type: activeTab === 'banners' ? 'banner' : activeTab === 'testimonials' ? 'testimonial' : 'faq' };

            if (isEditing && currentItem) {
                await axios.put(`http://localhost:5000/api/cms/${currentItem._id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/cms', payload, config);
            }
            setShowModal(false);
            resetForm();
            fetchItems();
        } catch (error) {
            console.error("Error saving item", error);
        }
    };

    const openEditModal = (item) => {
        setCurrentItem(item);
        setFormData({
            type: item.type,
            title: item.title || '',
            imageUrl: item.imageUrl || '',
            link: item.link || '',
            author: item.author || '',
            role: item.role || '',
            rating: item.rating || 5,
            content: item.content || '',
            question: item.question || '',
            order: item.order || 0,
            isActive: item.isActive
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Content Management</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <TabButton
                    active={activeTab === 'banners'}
                    onClick={() => setActiveTab('banners')}
                    icon={ImageIcon}
                    label="Banners"
                />
                <TabButton
                    active={activeTab === 'testimonials'}
                    onClick={() => setActiveTab('testimonials')}
                    icon={MessageSquare}
                    label="Testimonials"
                />
                <TabButton
                    active={activeTab === 'faqs'}
                    onClick={() => setActiveTab('faqs')}
                    icon={HelpCircle}
                    label="FAQs"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'banners' ? 'Homepage Banners' : activeTab === 'testimonials' ? 'Customer Reviews' : 'Frequently Asked Questions'}
                    </h2>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-brand-maroon text-white px-4 py-2 rounded-lg text-sm hover:bg-red-900 transition"
                    >
                        <Plus size={16} /> Add {activeTab === 'banners' ? 'Banner' : activeTab === 'testimonials' ? 'Testimonial' : 'FAQ'}
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader className="animate-spin text-gray-400" /></div>
                ) : (
                    <div className={activeTab === 'banners' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                        {items.length === 0 && <p className="text-gray-500 text-center py-8">No items found.</p>}

                        {items.map(item => (
                            <div key={item._id} className={`border rounded-xl border-gray-100 overflow-hidden group hover:shadow-md transition relative ${activeTab === 'banners' ? '' : 'p-4 flex justify-between items-start'}`}>
                                {activeTab === 'banners' && (
                                    <>
                                        <div className="h-40 bg-gray-100 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</span>
                                            )}
                                        </div>
                                        <div className="p-4 bg-white">
                                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-sm text-gray-500">Order: {item.order} • {item.isActive ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'testimonials' && (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-800">{item.author}</h4>
                                                <span className="text-xs text-brand-gold uppercase font-bold">{item.role}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm italic">"{item.content}"</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.rating} Stars</span>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'faqs' && (
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.question}</h4>
                                        <p className="text-gray-500 text-sm mt-1">{item.content}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded shadow-sm">
                                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 p-1"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-800">
                                {isEditing ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : activeTab === 'testimonials' ? 'Testimonial' : 'FAQ'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {activeTab === 'banners' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'testimonials' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Bride" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                                            <input type="number" min="1" max="5" className="w-full p-2 border rounded-lg" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                                            <textarea className="w-full p-2 border rounded-lg" rows="3" required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'faqs' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" required value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                                            <textarea className="w-full p-2 border rounded-lg" rows="4" required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Priority</label>
                                        <input type="number" className="w-full p-2 border rounded-lg" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-brand-maroon text-white py-3 rounded-lg font-bold hover:bg-red-900 transition mt-4">
                                    {isEditing ? 'Update' : 'Create'} Item
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${active ? 'bg-brand-maroon text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
    >
        <Icon size={18} /> {label}
    </button>
);

export default AdminCMS;
