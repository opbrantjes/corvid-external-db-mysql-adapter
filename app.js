const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbClient = require('./client/mysqlClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Wix External Database Adapter draait!');
});

// ✅ Route: Insert item
app.post('/data/insert', async (req, res) => {
  const { collectionName, item } = req.body;

  console.log('📥 /data/insert aangeroepen');
  console.log('➡️ Collection:', collectionName);
  console.log('📦 Item:', JSON.stringify(item, null, 2));

  try {
    const result = await dbClient.insert(collectionName, item);
    console.log('✅ Insert geslaagd:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Insert mislukt:', error);
    res.status(500).send(error.message || 'Onbekende fout bij insert');
  }
});

// ✅ Route: Query
app.post('/data/query', async (req, res) => {
  const { collectionName, query } = req.body;

  console.log('🔍 /data/query aangeroepen');
  console.log('➡️ Collection:', collectionName);
  console.log('🔎 Query:', JSON.stringify(query, null, 2));

  try {
    const result = await dbClient.query(collectionName, query);
    console.log('✅ Query resultaat:', result.length, 'records');
    res.json(result);
  } catch (error) {
    console.error('❌ Query mislukt:', error);
    res.status(500).send(error.message || 'Onbekende fout bij query');
  }
});

// ✅ Route: List schemas
app.post('/schemas/list', async (req, res) => {
  console.log('📑 /schemas/list aangeroepen');

  try {
    const result = await dbClient.listSchemas();
    console.log('✅ Schemas gevonden:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Schema ophalen mislukt:', error);
    res.status(500).send(error.message || 'Onbekende fout bij schemas ophalen');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server luistert op poort ${port}`);
});
