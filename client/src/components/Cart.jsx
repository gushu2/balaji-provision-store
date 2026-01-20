import React, { useMemo, useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }) {
    const [step, setStep] = useState('cart'); // cart, details, payment
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        transactionId: ''
    });

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 'cart') setStep('details');
        else if (step === 'details') {
            if (formData.name && formData.address) {
                setStep('payment');
            } else {
                alert('Please fill in Name and Address');
            }
        }
    };

    const handlePlaceOrder = () => {
        if (!formData.transactionId) {
            alert('Please enter Payment Transaction ID / UTR');
            return;
        }

        const ownerNumber = "919481023617"; // Country code + number
        let message = `*🛒 New Order from ${formData.name}* %0A`;
        message += `---------------------------%0A`;

        cartItems.forEach(item => {
            message += `▪️ ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}%0A`;
        });

        message += `---------------------------%0A`;
        message += `*💰 Total Amount: ₹${total.toFixed(2)}* %0A`;
        message += `*💳 Transaction ID:* ${formData.transactionId} %0A`;
        message += `---------------------------%0A`;
        message += `*📍 Delivery Details:* %0A`;
        message += `Name: ${formData.name} %0A`;
        if (formData.email) message += `Email: ${formData.email} %0A`;
        message += `Address: ${formData.address} %0A`;

        const whatsappUrl = `https://wa.me/${ownerNumber}?text=${message}`;

        // Also call onCheckout if parent needs to clear cart etc.
        onCheckout({
            customer_name: formData.name,
            customer_email: formData.email,
            customer_address: formData.address,
            transaction_id: formData.transactionId,
            cart_items: cartItems,
            total_amount: total
        });

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        setStep('cart');
        setFormData({ name: '', email: '', address: '', transactionId: '' });
    };

    const handleBack = () => {
        if (step === 'payment') setStep('details');
        else if (step === 'details') setStep('cart');
    };

    const steps = ['cart', 'details', 'payment'];
    const currentStepIndex = steps.indexOf(step);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-lg w-full flex">
                <div className="w-full h-full flex flex-col bg-white shadow-2xl transform transition-transform duration-300 animate-slide-in-right">

                    {/* Header */}
                    <div className="flex flex-col border-b border-gray-100 bg-white z-10">
                        <div className="flex items-center justify-between px-6 py-5">
                            <div className="flex items-center gap-3">
                                {step !== 'cart' && (
                                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                                    {step === 'cart' && 'Your Basket'}
                                    {step === 'details' && 'Delivery Details'}
                                    {step === 'payment' && 'Secure Payment'}
                                </h2>
                            </div>

                            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 pb-6">
                            <div className="flex items-center gap-2">
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                        {/* Step 1: Cart Items */}
                        {step === 'cart' && (
                            <div className="space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6 pt-32">
                                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-gray-900">Your basket is empty</p>
                                            <p className="text-gray-500 mt-2">Add some fresh groceries to get started!</p>
                                        </div>
                                        <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1 transition-all">Start Shopping</button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 relative">
                                                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-base font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                                                        <p className="ml-4 font-bold text-emerald-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-0.5 bg-gray-100 rounded-md inline-block">{item.category}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                        <button onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-red-500 transition-colors font-bold">-</button>
                                                        <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-green-600 transition-colors font-bold">+</button>
                                                    </div>
                                                    <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 hover:text-white hover:bg-red-500 font-semibold px-3 py-1.5 rounded-lg transition-all border border-red-100 hover:border-red-500">Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Step 2: Shipping Details */}
                        {step === 'details' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                                    <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Contact Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                className="block w-full rounded-xl border-gray-200 bg-white focus:border-green-500 focus:ring-green-500 sm:text-sm p-3.5 shadow-sm transition-all outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Email (Optional)</label>
                                            <input
                                                type="email"
                                                className="block w-full rounded-xl border-gray-200 bg-white focus:border-green-500 focus:ring-green-500 sm:text-sm p-3.5 shadow-sm transition-all outline-none"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Delivery Address
                                    </h3>
                                    <div>
                                        <textarea
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-green-500 sm:text-sm p-3.5 transition-all outline-none h-32 resize-none"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="House No, Street, Area, City..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 'payment' && (
                            <div className="flex flex-col items-center space-y-8 animate-fade-in pt-8">
                                <div className="text-center space-y-2">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-500">Total Amount</h3>
                                    <p className="text-5xl font-extrabold text-gray-900 tracking-tight">₹{total.toFixed(2)}</p>
                                </div>

                                {/* Digital QR Code */}
                                <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden group">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-inner">
                                            <QRCode
                                                value={`upi://pay?pa=paytmqr5xfgs5@ptys&pn=BalajiProvision&am=${total}&cu=INR`}
                                                size={200}
                                                level={"H"}
                                                includeMargin={true}
                                            />
                                        </div>
                                        <p className="text-xs font-mono text-gray-500">UPI ID: paytmqr5xfgs5@ptys</p>


                                    </div>
                                </div>

                                <div className="w-full max-w-sm space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Payment Transaction ID / UTR No.</label>
                                    <input
                                        type="text"
                                        className="block w-full rounded-xl border-gray-200 bg-white focus:border-green-500 focus:ring-green-500 sm:text-sm p-3.5 shadow-sm transition-all outline-none border"
                                        value={formData.transactionId}
                                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                        placeholder="Enter 12-digit UTR (e.g., 4293...)"
                                    />
                                    <p className="text-xs text-gray-500">Please enter the UTR number from your payment app after scanning.</p>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    {cartItems.length > 0 && (
                        <div className="bg-white px-6 py-6 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                            {step === 'cart' && (
                                <>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total (Tax incl.)</p>
                                            <p className="text-3xl font-extrabold text-gray-900">₹{total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full btn-primary py-4 text-lg justify-center shadow-lg shadow-green-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none"
                                    >
                                        Proceed to Checkout
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {step === 'details' && (
                                <button
                                    onClick={handleNext}
                                    className="w-full btn-primary py-4 text-lg justify-center shadow-lg shadow-green-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none"
                                >
                                    Continue to Payment
                                </button>
                            )}

                            {step === 'payment' && (
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full btn-primary py-4 text-lg justify-center shadow-lg shadow-green-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none"
                                >
                                    Confirm Order
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
