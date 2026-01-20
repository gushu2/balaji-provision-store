import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';

export default function Home({ addToCart, searchQuery }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, []);

    const categories = [
        { id: 'pooja', name: 'Pooja Needs', link: '/pooja', image: 'https://tse2.mm.bing.net/th?q=indian%20pooja%20thali%20items%20aesthetic&w=500&h=600&c=7&rs=1&p=0' },
        { id: 'groceries', name: 'Groceries', link: '/groceries', image: 'https://tse2.mm.bing.net/th?q=indian%20spices%20and%20pulses%20market%20heap&w=500&h=600&c=7&rs=1&p=0' },
        { id: 'sarees', name: 'Sarees', link: '/sarees', image: 'https://tse2.mm.bing.net/th?q=kanchipuram%20silk%20saree%20folded%20stack&w=500&h=600&c=7&rs=1&p=0' },
        { id: 'decor', name: 'Decor', link: '/decor', image: 'https://tse2.mm.bing.net/th?q=indian%20festival%20decor%20toran%20lights&w=500&h=600&c=7&rs=1&p=0' },
        { id: 'daily', name: 'Daily Needs', link: '/daily', image: 'https://tse2.mm.bing.net/th?q=indian%20supermarket%20daily%20needs%20products&w=500&h=600&c=7&rs=1&p=0' },
    ];

    // Show mix of products on home if searching, else show categories + featured
    const isSearching = searchQuery.length > 0;

    const displayProducts = isSearching
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : products.slice(0, 8); // Featured items (just first 8)

    return (
        <>
            {!isSearching && <Hero />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Categories Section - Only show when not searching */}
                {!isSearching && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-black text-red-900 font-serif mb-8 text-center uppercase tracking-widest border-b-2 border-orange-100 pb-4 inline-block mx-auto w-full">Shop By Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {categories.map(cat => (
                                <Link key={cat.id} to={cat.link} className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                        <h3 className="text-white font-bold text-lg group-hover:text-orange-200 transition-colors">{cat.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Featured / Search Results */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-red-900 font-serif uppercase tracking-widest">
                            {isSearching ? 'Search Results' : 'Featured Products'}
                        </h2>
                        {!isSearching && (
                            <Link to="/groceries" className="text-orange-700 font-bold hover:text-red-800 text-sm border-b-2 border-orange-200 hover:border-red-800 transition-all">
                                View All Products &rarr;
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {displayProducts.map(product => (
                                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
}
