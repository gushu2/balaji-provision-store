import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ cartCount, onOpenCart, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'text-orange-700 font-bold bg-orange-50' : 'text-stone-600 hover:text-orange-700 hover:bg-orange-50/50';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">

                    {/* Logo Section */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer gap-4 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <img src="/logo.jpg" alt="Balaji Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-2xl font-black text-red-800 font-serif tracking-tight leading-none uppercase drop-shadow-sm">
                                New Balaji
                            </span>
                            <span className="text-sm sm:text-xl font-bold text-orange-700 font-serif leading-none mt-1">
                                Provision Store
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-stone-500 tracking-widest uppercase mt-1">
                                Kundapura
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 font-medium text-sm">
                        <Link to="/pooja" className={`px-4 py-2 rounded-full transition-colors ${isActive('/pooja')}`}>Pooja</Link>
                        <Link to="/groceries" className={`px-4 py-2 rounded-full transition-colors ${isActive('/groceries')}`}>Groceries</Link>
                        <Link to="/sarees" className={`px-4 py-2 rounded-full transition-colors ${isActive('/sarees')}`}>Sarees</Link>
                        <Link to="/decor" className={`px-4 py-2 rounded-full transition-colors ${isActive('/decor')}`}>Decor</Link>
                        <Link to="/daily" className={`px-4 py-2 rounded-full transition-colors ${isActive('/daily')}`}>Daily Needs</Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:block max-w-xs xl:max-w-md w-full mx-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full bg-orange-50/50 border border-orange-200 rounded-full py-2.5 px-5 pl-10 text-stone-700 placeholder-stone-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                            />
                            <svg className="absolute left-3.5 top-3 h-5 w-5 text-orange-300 group-hover:text-orange-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onOpenCart}
                            className="relative p-2 sm:p-3 rounded-full hover:bg-orange-100 text-red-800 transition-colors duration-200 group border border-transparent hover:border-orange-200"
                            aria-label="Shopping Cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-md border-2 border-orange-50 animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button className="lg:hidden p-2 text-stone-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Home</Link>
                    <Link to="/pooja" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Pooja Needs</Link>
                    <Link to="/groceries" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Groceries</Link>
                    <Link to="/sarees" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Sarees</Link>
                    <Link to="/decor" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Decor</Link>
                    <Link to="/daily" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-stone-700 font-medium">Daily Needs</Link>
                </div>
            )}
        </nav>
    );
}
