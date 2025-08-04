const express = require('express');
const router = express.Router();
const db = require('../src/db');

router.post('/insert', async (req, res) => {
  const { collectionName, item, settings } = req.body;

  if (settings.secretKey !== process.env.SECRET_KEY) {
    return res.status(403).send('Forbidden: Invalid secret key');
  }

  try {
    console.log("✅ [INSERT] Ontvangen item:", item);

    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(',');

    const sql = `INSERT INTO ${collectionName} (${keys.join(',')}) VALUES (${placeholders})`;

    console.log("📄 [SQL]:", sql);
    console.log("📦 [VALUES]:", values);

    await db.query(sql, values);
    res.status(200).json({ success: true, message: 'Item inserted' });
  } catch (err) {
    console.error("❌ [DB Insert Error]:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
