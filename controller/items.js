const Storage = require('../service/storage');

exports.findItems = async (req, res) => {
  const findResult = await Storage.find(req.body);
  res.json(findResult);
};

exports.getItem = async (req, res) => {
  const getResult = await Storage.get(req.body);
  res.json(getResult);
};

exports.insertItem = async (req, res) => {
  const { collectionName, item, settings } = req.body;

  console.log("📥 Inkomend insert-verzoek:", req.body);

  // Secret key check
  if (!settings || settings.secretKey !== process.env.SECRET_KEY) {
    console.warn("🚫 Ongeldige secretKey:", settings?.secretKey);
    return res.status(403).send('Invalid secret key');
  }

  try {
    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(',');

    const sql = `INSERT INTO ${collectionName} (${keys.join(',')}) VALUES (${placeholders})`;

    console.log("🧾 SQL:", sql);
    console.log("📦 Values:", values);

    const db = require('../service/storage')._getDb();
    await db.query(sql, values);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Fout bij opslaan naar database:", error);
    res.status(500).send(error.message || 'Unknown error');
  }
};

exports.updateItem = async (req, res) => {
  const updateResult = await Storage.update(req.body);
  res.json(updateResult);
};

exports.removeItem = async (req, res) => {
  const removeResult = await Storage.remove(req.body);
  res.json(removeResult);
};

exports.countItems = async (req, res) => {
  const countResult = await Storage.count(req.body);
  res.json(countResult);
};
