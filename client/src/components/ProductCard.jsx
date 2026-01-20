import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-orange-100 ring-1 ring-transparent hover:ring-orange-200">
            <div className="relative aspect-square bg-orange-50 overflow-hidden border-b border-orange-100">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <button
                    onClick={() => onAddToCart(product)}
                    className="absolute bottom-3 right-3 bg-white text-red-800 p-2.5 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600 hover:text-white active:scale-95 border border-orange-100"
                    title="Add to Basket"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-widest border border-orange-200">
                        {product.category}
                    </span>
                    {/* Traditional Price Tag Feel */}
                    <span className="font-serif font-bold text-lg text-red-800 bg-red-50 px-2 rounded border border-red-100">
                        ₹{product.price.toFixed(2)}
                    </span>
                </div>

                <h3 className="text-base font-bold text-stone-800 leading-tight group-hover:text-red-800 transition-colors line-clamp-2 font-serif min-h-[2.5rem]">
                    {product.name}
                </h3>

                <button
                    onClick={() => onAddToCart(product)}
                    className="mt-2 w-full py-2.5 px-4 bg-white hover:bg-orange-600 hover:text-white text-stone-700 font-bold rounded-lg transition-all duration-200 border-2 border-orange-100 hover:border-transparent flex items-center justify-center gap-2 group/btn shadow-sm"
                >
                    <span>Add to Bag</span>
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
