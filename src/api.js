import { products } from './products';

// Use localtunnel URL for Orders API
const API_BASE_URL = 'https://balaji-kundapura-store.loca.lt/api';

export const fetchProducts = async () => {
    // Return local data immediately
    return {
        message: "success",
        data: products
    };
};

export const placeOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) {
        throw new Error('Failed to place order');
    }
    return response.json();
};
