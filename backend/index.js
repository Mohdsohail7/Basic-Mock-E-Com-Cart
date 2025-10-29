// index.js
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db/database");

const app = express();
app.use(cors());
app.use(express.json());

// Route imports
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");

// Mount routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", checkoutRoutes);

const PORT = process.env.PORT || 4000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
