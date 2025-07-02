require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://hongeee.xyz'  // your frontend domain
}));

app.use(express.json());

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Endpoint to check and initialize database if needed
app.get('/init-db', async (req, res) => {
  try {
    const fs = require('fs');
    const buildSql = fs.readFileSync('./build.sql', 'utf-8');

    await sql.connect(sqlConfig);
    await sql.query(buildSql);

    res.json({ message: 'Database initialized or already set up.' });
  } catch (error) {
    console.error('DB init error:', error);
    res.status(500).json({ error: 'Failed to initialize database.' });
  }
});

// GET counter
app.get('/counter', async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query`SELECT count FROM feed_counter WHERE id = 1`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Counter record not found' });
    }
    res.json({ count: result.recordset[0].count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST increment counter
app.post('/counter', async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    await sql.query`UPDATE feed_counter SET count = count + 1 WHERE id = 1`;
    const result = await sql.query`SELECT count FROM feed_counter WHERE id = 1`;
    res.json({ count: result.recordset[0].count });
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
