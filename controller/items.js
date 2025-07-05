const Storage = require('../service/storage');
const dbConnector = require('../service/db-connector'); // ✅ Deze had je nog nodig!

exports.findItems = async (req, res) => {
  const findResult = await Storage.find(req.body);
  res.json(findResult);
};

exports.getItem = async (req, res) => {
  const getResult = await Storage.get(req.body);
  res.json(getResult);
};

exports.insertItem = async (req, res) => {
  const insertResult = await Storage.insert(req.body);
  res.json(insertResult);
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

// ✅ Dit is de aangepaste route die je gebruikt in je Wix-backend:
exports.insert = async (req, res) => {
  try {
    console.log("📥 insert() aangeroepen met:", req.body);

    const { item, schemaId } = req.body;
    if (!item || !schemaId) {
      console.error("❌ item of schemaId ontbreekt");
      return res.status(400).json({ error: "item of schemaId ontbreekt" });
    }

    const db = await dbConnector.getDatabase(schemaId);
    const result = await db.insert(item);

    console.log("✅ insert() succesvol:", result);
    res.json({ inserted: result });

  } catch (err) {
    console.error("❌ insert() error:", err);
    res.status(500).json({ error: "Insert mislukt", details: err.message });
  }
};
