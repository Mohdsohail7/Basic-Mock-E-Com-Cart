const { runAsync, allAsync, getAsync } = require("../db/database");
const { ensureMockUser, MOCK_USER_ID } = require("../utils/ensureMockUser");


// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/checkout
exports.checkout = async (req, res) => {
  try {
    await ensureMockUser();
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    const cartItems = await allAsync(
      `SELECT ci.qty, p.price_cents FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?`,
      [MOCK_USER_ID]
    );

    if (!cartItems.length) return res.status(400).json({ error: "Cart is empty" });

    let totalCents = 0;

    for (const ci of cartItems) totalCents += ci.qty * ci.price_cents;

    const result = await runAsync(
      `INSERT INTO receipts (user_id, name, email, total_cents, note) VALUES (?, ?, ?, ?, ?)`,
      [MOCK_USER_ID, name, email, totalCents, "Mock checkout complete"]
    );

    await runAsync(`DELETE FROM cart_items WHERE user_id = ?`, [MOCK_USER_ID]);

    const receipt = await getAsync(`SELECT * FROM receipts WHERE id = ?`, [result.lastID]);
    res.json({
      message: "Checkout complete",
      receipt: {
        ...receipt,
        total: Number((receipt.total_cents / 100).toFixed(2))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

// GET /api/receipts
exports.getReceipts = async (req, res) => {
  try {
    await ensureMockUser();
    const rows = await allAsync(
      `SELECT id, name, email, total_cents, created_at, note FROM receipts WHERE user_id = ? ORDER BY created_at DESC`,
      [MOCK_USER_ID]
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
