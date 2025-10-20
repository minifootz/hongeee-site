require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: true // useful for local dev
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

module.exports = {
  sql, poolPromise
};

const { poolPromise } = require('./db');

app.get('/Feed_Num', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT Feed_Num FROM feeder WHERE feedID = 1');
    res.json({ Feed_Num: result.recordset[0].Feed_Num });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

