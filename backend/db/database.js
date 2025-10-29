// db/database.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_FILE = path.join(__dirname, "../ecom.sqlite");
const db = new sqlite3.Database(DB_FILE);

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function initDb() {
  await runAsync(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    sku TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    added_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    total_cents INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    note TEXT
  )`);

  const count = await getAsync(`SELECT COUNT(*) as c FROM products`);
  if (count.c === 0) {
    const products = [
      {
        name: "Vibe T-Shirt",
        description: "Comfort cotton tee",
        price_cents: 1999,
        sku: "VIBE-TSH-001",
      },
      {
        name: "Vibe Hoodie",
        description: "Warm pullover hoodie",
        price_cents: 3999,
        sku: "VIBE-HOOD-001",
      },
      {
        name: "Vibe Cap",
        description: "Adjustable cap",
        price_cents: 999,
        sku: "VIBE-CAP-001",
      },
      {
        name: "Vibe Sneakers",
        description: "Casual sneakers",
        price_cents: 5999,
        sku: "VIBE-SNK-001",
      },
      {
        name: "Vibe Mug",
        description: "Ceramic mug 350ml",
        price_cents: 799,
        sku: "VIBE-MUG-001",
      },
      {
        name: "Vibe Tote Bag",
        description: "Canvas eco tote bag",
        price_cents: 1499,
        sku: "VIBE-TOTE-001",
      },
      {
        name: "Vibe Water Bottle",
        description: "Stainless steel bottle 500ml",
        price_cents: 1899,
        sku: "VIBE-BOT-001",
      },
      {
        name: "Vibe Joggers",
        description: "Soft fleece jogger pants",
        price_cents: 3499,
        sku: "VIBE-JOG-001",
      },
      {
        name: "Vibe Socks",
        description: "Pack of 3 cotton socks",
        price_cents: 1299,
        sku: "VIBE-SCK-001",
      },
      {
        name: "Vibe Phone Case",
        description: "Protective phone case",
        price_cents: 1599,
        sku: "VIBE-PHC-001",
      },
      {
        name: "Vibe Keychain",
        description: "Metal logo keychain",
        price_cents: 499,
        sku: "VIBE-KEY-001",
      },
      {
        name: "Vibe Notebook",
        description: "Hardcover ruled notebook",
        price_cents: 1099,
        sku: "VIBE-NBK-001",
      },
      {
        name: "Vibe Backpack",
        description: "Durable 20L backpack",
        price_cents: 4599,
        sku: "VIBE-BPK-001",
      },
      {
        name: "Vibe Beanie",
        description: "Warm knitted beanie",
        price_cents: 1499,
        sku: "VIBE-BEA-001",
      },
      {
        name: "Vibe Sunglasses",
        description: "UV-protection sunglasses",
        price_cents: 2499,
        sku: "VIBE-SUN-001",
      },
      {
        name: "Vibe Poster",
        description: "Decorative wall poster",
        price_cents: 999,
        sku: "VIBE-PST-001",
      },
      {
        name: "Vibe Mouse Pad",
        description: "Smooth gaming mouse pad",
        price_cents: 1299,
        sku: "VIBE-MPD-001",
      },
      {
        name: "Vibe Hoodie (Zip)",
        description: "Zipper style fleece hoodie",
        price_cents: 4199,
        sku: "VIBE-HOOD-002",
      },
      {
        name: "Vibe Sweatshirt",
        description: "Classic crewneck sweatshirt",
        price_cents: 3299,
        sku: "VIBE-SWT-001",
      },
      {
        name: "Vibe Blanket",
        description: "Soft fleece throw blanket",
        price_cents: 2799,
        sku: "VIBE-BLN-001",
      },
    ];

    const insert = `INSERT INTO products (name, description, price_cents, sku) VALUES (?,?,?,?)`;
    for (const p of products) {
      await runAsync(insert, [p.name, p.description, p.price_cents, p.sku]);
    }
    console.log("Seeded default products.");
  }
}

module.exports = { db, runAsync, allAsync, getAsync, initDb };
