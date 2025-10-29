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
      { name: "Vibe T-Shirt", description: "Comfort cotton tee", price_cents: 1999, sku: "VIBE-TSH-001" },
      { name: "Vibe Hoodie", description: "Warm pullover hoodie", price_cents: 3999, sku: "VIBE-HOOD-001" },
      { name: "Vibe Cap", description: "Adjustable cap", price_cents: 999, sku: "VIBE-CAP-001" },
      { name: "Vibe Sneakers", description: "Casual sneakers", price_cents: 5999, sku: "VIBE-SNK-001" },
      { name: "Vibe Mug", description: "Ceramic mug 350ml", price_cents: 799, sku: "VIBE-MUG-001" }
    ];
    const insert = `INSERT INTO products (name, description, price_cents, sku) VALUES (?,?,?,?)`;
    for (const p of products) {
      await runAsync(insert, [p.name, p.description, p.price_cents, p.sku]);
    }
    console.log("Seeded default products.");
  }
}

module.exports = { db, runAsync, allAsync, getAsync, initDb };
