// server.js

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS - allow requests only from your frontend domain
app.use(cors({
  origin: 'https://hongeee.xyz'  // Replace with your actual frontend domain
}));

app.use(express.json());

// SQL Server configuration from environment variables
const sqlConfig = {
  user: process.env.DB_USER,           // e.g. 'db_username'
  password: process.env.DB_PASSWORD,   // e.g. 'db_password'
  server: process.env.DB_SERVER,       // e.g. 'db_host_or_ip'
  database: process.env.DB_NAME,       // e.g. 'db_name'
  options: {
    encrypt: true,                     // use true if your DB requires encrypted connection (Azure, etc.)
    trustServerCertificate: true      // set to false in production if you have proper certificates
  }
};

// GET endpoint: fetch current feed count
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

// POST endpoint: increment feed count by 1
app.post('/counter', async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    // Increment count
    await sql.query`UPDATE feed_counter SET count = count + 1 WHERE id = 1`;
    // Fetch updated count
    const result = await sql.query`SELECT count FROM feed_counter WHERE id = 1`;
    res.json({ count: result.recordset[0].count });
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server, listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
