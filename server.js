// server.js

require('dotenv').config();   // Load variables from .env file (optional)

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS - adjust origin to your frontend domain
app.use(cors({
  origin: 'https://hongeee.xyz'  // Replace with your frontend domain
}));

app.use(express.json());

// SQL Server config from environment variables
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,                 // true if using Azure SQL or encrypted connection
    trustServerCertificate: true  // false in production with valid certs
  }
};

// GET feed count
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

// POST increment count
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

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
