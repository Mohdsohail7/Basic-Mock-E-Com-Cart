const { allAsync } = require("../db/database")


exports.getProducts = async (req, res) => {
    try {
        const products = await allAsync(
            `SELECT id, name, description, price_cents, sku, image_url FROM products`
        );
        res.json(products.map((product) => ({
            ...product,
            price: Number((product.price_cents / 100).toFixed(2)),
        })))
    } catch (error) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}