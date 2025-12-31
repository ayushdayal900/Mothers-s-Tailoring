import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const Gallery = () => {
    const [filter, setFilter] = useState('All');

    // Placeholder Data
    const galleryItems = [
        { id: 1, category: 'Rajlaxmi', event: 'Wedding', image: 'https://images.unsplash.com/photo-1545959783-c28f64582cb5?auto=format&fit=crop&q=80&w=800', note: 'Bridal Royal Pack' },
        { id: 2, category: 'Peshwai', event: 'Festival', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', note: 'Diwali Special' },
        { id: 3, category: 'Mastani', event: 'Reception', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', note: 'Fusion Gown Saree' },
        { id: 4, category: 'Normal', event: 'Daily Wear', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=800', note: 'Designer Blouse' },
        { id: 5, category: 'Rajlaxmi', event: 'Wedding', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800', note: 'Paithani Drape' },
        { id: 6, category: 'Peshwai', event: 'Puja', image: 'https://images.unsplash.com/photo-1627931328065-22d7ba4862b6?auto=format&fit=crop&q=80&w=800', note: 'Traditional Look' },
    ];

    const filteredItems = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter);
    const categories = ['All', 'Rajlaxmi', 'Peshwai', 'Mastani', 'Normal'];

    return (
        <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-brand-maroon mb-4">Customer Gallery</h1>
                    <p className="text-gray-600">See how our creations bring elegance to your special moments.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full border transition ${filter === cat
                                ? 'bg-brand-maroon text-white border-brand-maroon'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-maroon'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer">
                            <img
                                src={item.image}
                                alt={item.note}
                                className="w-full h-80 object-cover transition duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
                                <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-1">{item.category}</span>
                                <h3 className="text-white text-lg font-bold">{item.note}</h3>
                                <p className="text-gray-300 text-sm">{item.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
