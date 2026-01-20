const API_BASE_URL = 'https://balaji-kundapura-store.loca.lt/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
            'Bypass-Tunnel-Reminder': 'true'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
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
