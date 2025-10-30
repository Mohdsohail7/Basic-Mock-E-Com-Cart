const { allAsync, runAsync, getAsync } = require("../db/database");

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    let products = await allAsync(`SELECT id, name, description, price_cents, sku, image_url FROM products`);

    // If no products in DB, fetch from Fake Store API
    if (products.length === 0) {
        console.log("Fetching products from Fake Store API...");
        const response = await fetch("https://fakestoreapi.com/products");
        const apiProducts = await response.json();

      // Insert into DB
      const insertSQL = `INSERT INTO products (name, description, price_cents, sku, image_url) VALUES (?,?,?,?,?)`;
      for (const p of apiProducts) {
        const priceCents = Math.round(p.price * 100);
        const sku = `FAKE-${p.id}`;
        await runAsync(insertSQL, [p.title, p.description, priceCents, sku, p.image]);
      }

      products = await allAsync(`SELECT id, name, description, price_cents, sku, image_url FROM products`);
    }

    res.json(products.map((product) => ({
      ...product,
      price: Number((product.price_cents / 100).toFixed(2)),
    })));
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
