
const { getAsync, runAsync } = require("../db/database");

const MOCK_USER_ID = 1;

async function ensureMockUser() {
  const user = await getAsync(`SELECT * FROM users WHERE id = ?`, [MOCK_USER_ID]);

  if (!user) {
    await runAsync(
      `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`,
      [MOCK_USER_ID, "Sohail", "sohail@example.com"]
    );
    console.log("Mock user created:", { id: MOCK_USER_ID, name: "Sohail" });
  }

  return MOCK_USER_ID;
}

module.exports = {
  ensureMockUser,
  MOCK_USER_ID,
};
