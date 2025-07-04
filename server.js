require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const fs = require('fs');

const app = express();

// Use PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;

// CORS configuration (adjust as needed)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // safer fallback
  methods: ['GET', 'POST'],
  credentials: false
}));

app.use(express.json());

// SINGLE shared connection pool
const sqlPoolPromise = new sql.ConnectionPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
})
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

/**
 * GET /init-db
 * Initialize the DB if needed
 */
app.get('/init-db', async (req, res) => {
  try {
    const buildSql = fs.readFileSync('./build.sql', 'utf-8');
    const pool = await sqlPoolPromise;
    await pool.request().batch(buildSql);
    res.json({ message: '✅ Database initialized or already set up.' });
  } catch (error) {
    console.error('❌ DB init error:', error);
    res.status(500).json({ error: 'Failed to initialize database.', details: error.message });
  }
});

/**
 * GET /Feed_Num
 * Fetch the current Feed_Num
 */
app.get('/Feed_Num', async (req, res) => {
  const pool = await sqlPoolPromise;
  try {
    const result = await pool.request().query('SELECT Feed_Num FROM feeder WHERE feedID = 1');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Counter record not found' });
    }
    res.json({ Feed_Num: result.recordset[0].Feed_Num });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

/**
 * POST /Feed_Num
 * Increment and return the updated Feed_Num
 */
app.post('/Feed_Num', async (req, res) => {
  const pool = await sqlPoolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    await request.query('UPDATE feeder SET Feed_Num = Feed_Num + 1 WHERE feedID = 1');
    const result = await request.query('SELECT Feed_Num FROM feeder WHERE feedID = 1');
    await transaction.commit();
    res.json({ Feed_Num: result.recordset[0].Feed_Num });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

/**
 * Start the server
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
