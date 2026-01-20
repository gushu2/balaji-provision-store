const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// --- ROUTES ---

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM products");
        res.json({
            "message": "success",
            "data": result.rows
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        const sql = "SELECT * FROM products WHERE id = ?";
        const result = await db.query(sql, [req.params.id]);
        res.json({
            "message": "success",
            "data": result.rows[0]
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    const { customer_name, customer_email, customer_address, cart_items, total_amount, transaction_id } = req.body;

    if (!customer_name || !customer_address || !cart_items || cart_items.length === 0) {
        res.status(400).json({ "error": "Invalid order data" });
        return;
    }

    try {
        // Start Transaction
        await db.query("BEGIN TRANSACTION");

        // 1. Insert Order
        const insertOrderSql = "INSERT INTO orders (customer_name, customer_email, customer_address, total_amount, transaction_id) VALUES (?, ?, ?, ?, ?)";
        const orderResult = await db.query(insertOrderSql, [customer_name, customer_email, customer_address, total_amount, transaction_id]);

        const orderId = orderResult.lastID; // Works for both SQLite (this.lastID) and Postgres (RETURNING id)

        // 2. Insert Items
        // Note: For high performance apps, we would construct a single bulk INSERT string,
        // but for this scale, Awaiting in a loop is perfectly safe and clear.
        for (const item of cart_items) {
            const insertItemSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";
            await db.query(insertItemSql, [orderId, item.id, item.quantity, item.price]);
        }

        // Commit Transaction
        await db.query("COMMIT");

        res.json({
            "message": "success",
            "orderId": orderId
        });

    } catch (err) {
        // Rollback on any error
        await db.query("ROLLBACK");
        console.error("Order Error:", err);
        res.status(400).json({ "error": err.message });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Initialize DB then Start Server
db.init().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
