const bcrypt = require("bcryptjs");

async function hashPassword(regularPassword) {
  try {
    return await bcrypt.hash(regularPassword, 10);
  } catch (error) {
    console.error("Error: Issue hashing password ->", error);
  }
}

async function verifyPassword(regularPassword, hash) {
  try {
    return await bcrypt.compare(regularPassword, hash);
  } catch (error) {
    console.error("Error: Issue verifying password ->", error);
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
};
