const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Determine Environment
const isPostgres = !!process.env.DATABASE_URL;
let pgPool;
let sqliteDb;

// --- DATABASE CONNECTION ---
const connectDB = () => {
  if (isPostgres) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ Connected to PostgreSQL Database');
  } else {
    const dbPath = path.resolve(__dirname, 'ecommerce.db');
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('Error opening SQLite DB:', err.message);
      else console.log('✅ Connected to Local SQLite Database');
    });
  }
};

// --- UNIFIED QUERY EXECUTION ---
const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      // Convert SQLite '?' placeholders to Postgres '$1, $2...'
      let i = 1;
      let pgText = text.replace(/\?/g, () => `$${i++}`);

      // Auto-append RETURNING id for INSERTs to simulate sqlite3's this.lastID
      if (pgText.trim().toUpperCase().startsWith('INSERT') && !pgText.toUpperCase().includes('RETURNING')) {
        pgText += ' RETURNING id';
      }

      pgPool.query(pgText, params, (err, res) => {
        if (err) return reject(err);

        // Unify output: Postgres returns { rows, rowCount }
        // We map this to match what our app expects
        resolve({
          rows: res.rows,
          lastID: res.rows.length > 0 && res.rows[0].id ? res.rows[0].id : null // For RETURNING id usage
        });
      });
    } else {
      // SQLite Execution
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        sqliteDb.all(text, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows: rows });
        });
      } else {
        sqliteDb.run(text, params, function (err) {
          if (err) return reject(err);
          resolve({ rows: [], lastID: this.lastID }); // 'this' contains lastID for inserts
        });
      }
    }
  });
};

// --- IMAGE HELPER ---
const getImg = (query) => {
  const cleanQuery = query.replace(/\(.*?\)/g, '').replace(/\d+[kg|g|ml|L|pcs]/gi, '').trim();
  let searchTerm = cleanQuery;
  if (query.includes('Saree')) searchTerm += ' saree full view';
  else if (query.includes('Rice')) searchTerm += ' raw rice grain';
  else if (query.includes('Oil')) searchTerm += ' bottle';
  else searchTerm += ' product india';
  return `https://tse2.mm.bing.net/th?q=${encodeURIComponent(searchTerm)}&w=500&h=500&c=7&rs=1&p=0`;
};

// --- DATA ---
const products = [
  ['Cycle Pure Agarbatti (Pack of 6)', 80, 'Premium fragrance incense sticks for daily pooja.', 'Pooja Needs'],
  ['Mangaldeep Sandal Agarbatti', 45, 'Rich sandalwood fragrance incense sticks.', 'Pooja Needs'],
  ['Camphor / Karpooram (100g)', 120, 'Pure camphor tablets for aarti.', 'Pooja Needs'],
  ['Pure Desi Ghee (Pooja Purpose) 500ml', 350, 'Pure cow ghee for lighting lamps.', 'Pooja Needs'],
  ['Cotton Wicks / Batti (Round) - 100pcs', 30, 'Ready to use round cotton wicks.', 'Pooja Needs'],
  ['Cotton Wicks (Long) - 100pcs', 35, 'Long wicks for traditional deepam.', 'Pooja Needs'],
  ['Pooja Oil (1L)', 180, 'Blend of 5 oils (Pancha Deepam Oil).', 'Pooja Needs'],
  ['Kumkum (Roli) - 50g', 25, 'Pure red kumkum for tilak.', 'Pooja Needs'],
  ['Haldi Powder (Pooja Special) - 50g', 20, 'Holy turmeric powder.', 'Pooja Needs'],
  ['Chandan / Sandalwood Paste', 60, 'Fragrant sandalwood paste for deities.', 'Pooja Needs'],
  ['Vibhuti / Sacred Ash', 15, 'Holy ash for applying on forehead.', 'Pooja Needs'],
  ['Rangoli Powder (White) - 1kg', 40, 'Fine white rangoli powder.', 'Pooja Needs'],
  ['Rangoli Color Set (12 Colors)', 180, 'Vibrant colors for festive rangoli.', 'Pooja Needs'],
  ['Brass Diya (Small pair)', 250, 'Traditional brass oil lamps.', 'Pooja Needs'],
  ['Agarbatti Stand (Steel)', 45, 'Stainless steel incense holder.', 'Pooja Needs'],
  ['Pooja Bell (Ghanti) - Brass', 300, 'Handheld brass bell with sweet sound.', 'Pooja Needs'],
  ['Mango Leaves (Artificial) Toran', 150, 'Plastic mango leaf toran for door.', 'Pooja Needs'],
  ['Ganga Jal (200ml)', 25, 'Holy water from the Ganges.', 'Pooja Needs'],
  ['Janeu / Sacred Thread (Pair)', 20, 'Traditional sacred thread.', 'Pooja Needs'],
  ['Supari / Betel Nut (Whole) - 100g', 80, 'Whole betel nuts for pooja offering.', 'Pooja Needs'],
  ['Boiled Rice / Kuchalakki (10kg)', 480, 'Kundapura special boiled rice.', 'Groceries'],
  ['Sona Masoori Rice (10kg)', 550, 'Premium daily use steamed rice.', 'Groceries'],
  ['India Gate Basmati Rice (5kg)', 649, 'Long grain aromatic basmati rice.', 'Groceries'],
  ['Idli Rice (5kg)', 280, 'Short grain rice specially for Idli/Dosa batter.', 'Groceries'],
  ['Dosa Rice (Raw Rice) 5kg', 290, 'Raw rice for crispy dosas.', 'Groceries'],
  ['Toor Dal (1kg)', 160, 'Farm fresh unpolished Toor Dal.', 'Groceries'],
  ['Moong Dal (Yellow) - 1kg', 140, 'Easy to digest split yellow moong dal.', 'Groceries'],
  ['Urad Dal (Whole White) - 1kg', 180, 'Premium urad dal for idli batter.', 'Groceries'],
  ['Chana Dal (1kg)', 110, 'Split chickpea bengal gram.', 'Groceries'],
  ['Masoor Dal (1kg)', 130, 'Red lentil dal.', 'Groceries'],
  ['Atta / Wheat Flour (10kg)', 440, 'Whole wheat flour for soft rotis.', 'Groceries'],
  ['Maida (1kg)', 55, 'Refined wheat flour for bakery items.', 'Groceries'],
  ['Sooji / Rava (1kg)', 60, 'Roasted rava for upma and sheera.', 'Groceries'],
  ['Ragi Flour (1kg)', 50, 'Healthy finger millet flour.', 'Groceries'],
  ['Rice Flour (1kg)', 50, 'Fine rice flour for rottis/snacks.', 'Groceries'],
  ['Coconut Oil (1L - Loose)', 220, 'Pure filtered coconut oil (local style).', 'Groceries'],
  ['Sunflower Oil (1L Pouch)', 135, 'Refined sunflower oil.', 'Groceries'],
  ['Mustard Seeds (Rai) - 100g', 30, 'Small black mustard seeds.', 'Groceries'],
  ['Cumin Seeds (Jeera) - 100g', 60, 'Aromatic cumin seeds.', 'Groceries'],
  ['Fenugreek Seeds (Methi) - 100g', 25, 'Digestive fenugreek seeds.', 'Groceries'],
  ['Black Pepper (Whole) - 50g', 75, 'Spicy black peppercorns.', 'Groceries'],
  ['Cardamom (Elaichi) - 25g', 90, 'Green fragrant cardamom.', 'Groceries'],
  ['Clove (Laung) - 25g', 45, 'Aromatic cloves.', 'Groceries'],
  ['Cinnamon (Dalchini) - 50g', 40, 'Cassia bark cinnamon.', 'Groceries'],
  ['Turmeric Powder (200g)', 65, 'Antiseptic cooking turmeric.', 'Groceries'],
  ['Red Chilli Powder (200g)', 85, 'Medium spicy red chilli powder.', 'Groceries'],
  ['Coriander Powder (200g)', 55, 'Aromatic dhaniya powder.', 'Groceries'],
  ['Kundapura Chicken Masala (100g)', 70, 'Special spicy masala blend.', 'Groceries'],
  ['Sambar Powder (250g)', 95, 'Authentic brahmin style sambar powder.', 'Groceries'],
  ['Tamarind (500g)', 120, 'Seedless dried tamarind slab.', 'Groceries'],
  ['Cotton Daily Wear Saree (Blue)', 450, 'Comfortable pure cotton printed saree.', 'Sarees'],
  ['Cotton Daily Wear Saree (Red)', 450, 'Comfortable pure cotton printed saree.', 'Sarees'],
  ['Cotton Daily Wear Saree (Green)', 450, 'Comfortable pure cotton printed saree.', 'Sarees'],
  ['Synthetic Saree (Floral)', 350, 'Lightweight wash and wear saree.', 'Sarees'],
  ['Synthetic Saree (Geometrical)', 350, 'Lightweight wash and wear saree.', 'Sarees'],
  ['Kerala Kasavu Cotton Saree', 850, 'Off-white saree with golden border.', 'Sarees'],
  ['Mysore Silk Crepe Saree (Art Silk)', 1200, 'Soft flowy art silk saree for occasions.', 'Sarees'],
  ['Temple Border Cotton Saree', 650, 'Traditional temple border design.', 'Sarees'],
  ['Lungi (Cotton Checkered)', 180, 'Traditional cotton lungi for men.', 'Sarees'],
  ['Lungi (White/Plain)', 200, 'White cotton lungi.', 'Sarees'],
  ['Bath Towel (Thundu) - Cotton', 120, 'Absorbent white cotton towel.', 'Sarees'],
  ['Blouse Piece (2x2 Rubia) - Red', 80, 'cut piece for blouse stitching.', 'Sarees'],
  ['Blouse Piece (2x2 Rubia) - Green', 80, 'cut piece for blouse stitching.', 'Sarees'],
  ['Petticoat / Inskirt', 150, 'Cotton underskirt matching colors.', 'Sarees'],
  ['Handkerchief Set (6pcs)', 100, 'Cotton handkerchiefs.', 'Sarees'],
  ['Door Toran (Beads work)', 350, 'Handmade bead work toran.', 'Decor'],
  ['Flower Garland (Artificial Marigold)', 120, 'Yellow/Orange artificial flower string (5ft).', 'Decor'],
  ['LED String Lights (Yellow) 10m', 150, 'Decorative fairy lights.', 'Decor'],
  ['LED String Lights (Multi) 10m', 150, 'Decorative fairy lights.', 'Decor'],
  ['Clay Diyas (Set of 12)', 60, 'Eco-friendly earthen lamps.', 'Decor'],
  ['Rangoli Stencils (Set of 4)', 80, 'Plastic stencils for easy rangoli.', 'Decor'],
  ['Wall Hanging (Ganesha)', 450, 'Metal/Plastic Ganesha wall decor.', 'Decor'],
  ['Door Mat (Traditional Coir)', 180, 'Durable coir door mat.', 'Decor'],
  ['Fancy Diya (Painted)', 120, 'Hand painted decorative diyas.', 'Decor'],
  ['Incense Holder (Wooden)', 60, 'Carved wooden agarbatti holder.', 'Decor'],
  ['Showpiece Elephant Pair', 200, 'Small ceramic elephants.', 'Decor'],
  ['Floating Candles (Set of 6)', 150, 'Candles for water bowl decoration.', 'Decor'],
  ['Urali (Decor Bowl) - Brass Finish', 550, 'Bowl for floating flowers.', 'Decor'],
  ['Toran (Embroidered fabric)', 250, 'Cloth based embroidered door hanging.', 'Decor'],
  ['Wind Chime', 350, 'Metal wind chime for positive vibes.', 'Decor'],
  ['Rin Detergent Bar (250g)', 35, 'Laundry soap bar.', 'Daily Needs'],
  ['Surf Excel Powder (1kg)', 130, 'Washing powder for clothes.', 'Daily Needs'],
  ['Vim Dishwash Bar (300g)', 25, 'Lemon dishwash bar.', 'Daily Needs'],
  ['Vim Liquid (500ml)', 115, 'Dishwashing liquid gel.', 'Daily Needs'],
  ['Lizol Floor Cleaner (1L)', 190, 'Disinfectant floor cleaner.', 'Daily Needs'],
  ['Harpic Toilet Cleaner (500ml)', 95, 'Toilet cleaning liquid.', 'Daily Needs'],
  ['Colgate Toothpaste (200g)', 110, 'Regular strong teeth toothpaste.', 'Daily Needs'],
  ['Sensodyne Toothpaste (100g)', 160, 'For sensitive teeth.', 'Daily Needs'],
  ['Lux Soap (100g)', 40, 'Beauty soap bar.', 'Daily Needs'],
  ['Lifebuoy Soap (125g)', 35, 'Germ protection soap.', 'Daily Needs'],
  ['Santoor Soap (Pack of 4)', 140, 'Sandal and turmeric soap.', 'Daily Needs'],
  ['Clinic Plus Shampoo (340ml)', 180, 'Strong and long health shampoo.', 'Daily Needs'],
  ['Parachute Coconut Oil (Hair) 200ml', 90, 'Hair oil.', 'Daily Needs'],
  ['Ponds Talcum Powder (100g)', 85, 'Fragrant face powder.', 'Daily Needs'],
  ['Broom (Soft/Indoor)', 120, 'Phool jhadu for dust.', 'Daily Needs'],
  ['Broom (Coconut/Outdoor)', 80, 'Coconut stick broom for rough use.', 'Daily Needs'],
  ['Floor Mop (Cotton)', 150, 'Stick mop for floor cleaning.', 'Daily Needs'],
  ['Plastic Bucket (15L)', 220, 'Heavy duty plastic bucket.', 'Daily Needs'],
  ['Mug (1L)', 40, 'Plastic bathroom mug.', 'Daily Needs'],
  ['Garbage Bags (Medium) - 30pcs', 120, 'Black garbage disposal bags.', 'Daily Needs']
];

// --- INIT DB ---
const init = async () => {
  connectDB();

  // SQL Dialect Differences
  const AUTO_INCREMENT = isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const TIMESTAMP = isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

  try {
    // We only Create Tables if they don't exist.
    // NOTE: In production (Postgres), we do NOT drop tables!
    // In local (SQLite), users often want a reset, but to keep it unified, we will persist.
    // If you need a hard reset, delete the .db file manually.

    await query(`CREATE TABLE IF NOT EXISTS products (
            id ${AUTO_INCREMENT},
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image_url TEXT,
            category TEXT
        )`);

    await query(`CREATE TABLE IF NOT EXISTS orders (
            id ${AUTO_INCREMENT},
            customer_name TEXT NOT NULL,
            customer_email TEXT,
            customer_address TEXT,
            total_amount REAL NOT NULL,
            transaction_id TEXT,
            order_date ${TIMESTAMP}
        )`);

    await query(`CREATE TABLE IF NOT EXISTS order_items (
            id ${AUTO_INCREMENT},
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price_at_purchase REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

    // Seed Products ONLY if empty
    const countRes = await query("SELECT COUNT(*) as count FROM products");
    const count = isPostgres ? parseInt(countRes.rows[0].count) : countRes.rows[0].count;

    if (count === 0) {
      console.log(`Seeding ${products.length} products...`);
      for (const p of products) {
        let imageUrl = getImg(p[0]);
        if (p[0].includes('Pure Desi Ghee')) imageUrl = '/images/pure-desi-ghee.jpg';

        await query("INSERT INTO products (name, price, description, category, image_url) VALUES (?, ?, ?, ?, ?)",
          [p[0], p[1], p[2], p[3], imageUrl]
        );
      }
      console.log('✅ Seeding Complete.');
    } else {
      console.log('ℹ️ Products already exist. Skipping seed.');
    }

  } catch (err) {
    console.error('❌ Database Init Error:', err);
  }
};

module.exports = { init, query };
