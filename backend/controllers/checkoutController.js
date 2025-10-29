const { runAsync, allAsync, getAsync } = require("../db/database");


// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/checkout
exports.checkout = async (req, res) => {
  try {
    const { cartItems, name, email } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email is invalid" });
    }

    let totalCents = 0;

    // If cart items are provided in the request body
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      for (const ci of cartItems) {
        if (!ci.productId || !ci.qty) {
          return res.status(400).json({ error: "Each cartItem must have productId and qty" });
        }
        const p = await getAsync(`SELECT price_cents FROM products WHERE id = ?`, [ci.productId]);
        if (!p) return res.status(400).json({ error: `Product ${ci.productId} not found` });
        totalCents += p.price_cents * ci.qty;
      }
    } else {
      // If no cart items passed, use existing cart in DB
      const rows = await allAsync(
        `SELECT ci.qty, p.price_cents 
         FROM cart_items ci 
         JOIN products p ON p.id = ci.product_id`
      );
      for (const r of rows) {
        totalCents += r.price_cents * r.qty;
      }
    }

    // Create a mock receipt
    const note = `Mock checkout — ${name}`;
    const result = await runAsync(
      `INSERT INTO receipts (name, email, total_cents, note) VALUES (?,?,?,?)`,
      [name, email, totalCents, note]
    );

    // Clear the cart
    await runAsync(`DELETE FROM cart_items`);

    // Fetch the new receipt
    const receipt = await getAsync(
      `SELECT id, name, email, total_cents, created_at, note FROM receipts WHERE id = ?`,
      [result.lastID]
    );

    res.json({
      receipt: {
        id: receipt.id,
        name: receipt.name,
        email: receipt.email,
        totalCents: receipt.total_cents,
        total: Number((receipt.total_cents / 100).toFixed(2)),
        timestamp: receipt.created_at,
        note: receipt.note
      },
      message: "Mock checkout complete"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

// GET /api/receipts
exports.getReceipts = async (req, res) => {
  try {
    const rows = await allAsync(
      `SELECT id, name, email, total_cents, created_at, note 
       FROM receipts 
       ORDER BY created_at DESC`
    );

    res.json(
      rows.map((r) => ({
        ...r,
        total: Number((r.total_cents / 100).toFixed(2))
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
};
