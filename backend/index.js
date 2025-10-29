// index.js
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db/database");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
