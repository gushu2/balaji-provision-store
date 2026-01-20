import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';

export default function ShopCategory({ category, title, addToCart, searchQuery }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchProducts()
            .then(response => {
                // Filter by category
                const filtered = response.data.filter(p => p.category === category || (category === 'All' && true));
                setProducts(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [category]);

    const displayProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-orange-200">
                <div>
                    <h1 className="text-3xl font-black text-red-900 font-serif mb-2">{title}</h1>
                    <p className="text-stone-600">Showing {displayProducts.length} items</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                    {displayProducts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-stone-500">
                            No products found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
