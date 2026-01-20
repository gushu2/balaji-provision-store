import React from 'react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-orange-50 pt-28 pb-32 space-y-24">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D97706 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24 items-center">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0 col-start-2">
                        <div>
                            <div className="mt-6 border-l-4 border-orange-500 pl-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
                                    <span className="text-sm font-bold text-red-700 tracking-wider uppercase">Over 100 Years of Service</span>
                                </div>
                                <h2 className="text-4xl font-extrabold tracking-tight text-red-900 font-serif sm:text-5xl leading-tight">
                                    Tradition Meets<br />
                                    <span className="text-orange-600">Trust & Quality</span>
                                </h2>
                                <p className="mt-4 text-xl text-stone-700 leading-relaxed font-medium">
                                    Welcome to <b>New Balaji Provision Store, Kundapura</b>. We bring you authentic groceries, purity-guaranteed Pooja items, and home essentials.
                                </p>
                                <div className="mt-8 flex gap-4">
                                    <a
                                        href="#"
                                        className="inline-flex px-8 py-4 border-2 border-red-800 text-lg font-bold rounded-xl shadow-xl text-white bg-red-800 hover:bg-red-900 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Order Groceries
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                        <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                            <div className="relative rounded-3xl shadow-2xl ring-4 ring-orange-100 overflow-hidden group">
                                <div className="absolute inset-0 border-8 border-double border-orange-200/50 rounded-3xl z-10 pointer-events-none"></div>
                                <img
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                                    src="/images/hero-products-only.png"
                                    alt="Premium collection of Indian groceries, pooja items, and textiles"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                                    <p className="text-white font-serif text-2xl italic">"Quality you can pray with."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
