const { runAsync, allAsync, getAsync } = require("../db/database");
const { ensureMockUser, MOCK_USER_ID } = require("../utils/ensureMockUser");



// Wrap cart routes to include mock user
exports.addToCart = async (req, res) => {
  try {
    await ensureMockUser();
    const { productId, qty } = req.body;
    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ error: "productId and qty>0 required" });
    }

    const product = await getAsync(`SELECT id FROM products WHERE id = ?`, [productId]);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const existing = await getAsync(
      `SELECT id, qty FROM cart_items WHERE product_id = ? AND user_id = ?`,
      [productId, MOCK_USER_ID]
    );

    if (existing) {
      const newQty = existing.qty + Number(qty);
      await runAsync(`UPDATE cart_items SET qty = ? WHERE id = ?`, [newQty, existing.id]);
      const updated = await getAsync(`SELECT * FROM cart_items WHERE id = ?`, [existing.id]);
      return res.status(200).json({ message: "Cart updated", item: updated });
    } else {
      const result = await runAsync(
        `INSERT INTO cart_items (user_id, product_id, qty) VALUES (?, ?, ?)`,
        [MOCK_USER_ID, productId, qty]
      );
      const newItem = await getAsync(`SELECT * FROM cart_items WHERE id = ?`, [result.lastID]);
      return res.status(201).json({ message: "Added to cart", item: newItem });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// DELETE /api/cart/:id
exports.deleteCartItem = async (req, res) => {
  try {
    await ensureMockUser();
    const id = req.params.id;
    const item = await getAsync(
      `SELECT * FROM cart_items WHERE id = ? AND user_id = ?`,
      [id, MOCK_USER_ID]
    );

    if (!item) return res.status(404).json({ error: "Cart item not found" });

    await runAsync(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, [id, MOCK_USER_ID]);
    res.json({ message: "Removed from cart", removedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
};

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    await ensureMockUser();
    const items = await allAsync(
      `SELECT ci.id as cart_item_id, ci.qty, p.id as product_id, p.name, p.description, p.price_cents
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [MOCK_USER_ID]
    );



    let subtotalCents = 0;
    const itemsWithTotals = items.map((it) => {
      const lineCents = it.price_cents * it.qty;
      subtotalCents += lineCents;
      return {
        cartItemId: it.cart_item_id,
        productId: it.product_id,
        name: it.name,
        description: it.description,
        qty: it.qty,
        unitPriceCents: it.price_cents,
        unitPrice: Number((it.price_cents / 100).toFixed(2)),
        lineTotal: Number((lineCents / 100).toFixed(2))
      };
    });

    res.json({
      items: itemsWithTotals,
      subtotal: Number((subtotalCents / 100).toFixed(2)),
      totalCents: subtotalCents,
      total: Number((subtotalCents / 100).toFixed(2)),
      currency: "USD"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// PUT /api/cart/:id { qty }
exports.updateCartItem = async (req, res) => {
  try {
    await ensureMockUser();
    const { qty } = req.body;
    const id = req.params.id;

    if (!qty || qty <= 0) return res.status(400).json({ error: "Qty must be > 0" });

    const item = await getAsync(
      `SELECT * FROM cart_items WHERE id = ? AND user_id = ?`,
      [id, MOCK_USER_ID]
    );

    if (!item) return res.status(404).json({ error: "Cart item not found" });

    await runAsync(`UPDATE cart_items SET qty = ? WHERE id = ?`, [qty, id]);
    const updated = await getAsync(`SELECT * FROM cart_items WHERE id = ?`, [id]);

    res.json({ message: "Quantity updated", item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

