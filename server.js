const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = './feeder.db';

// Enable CORS - adjust origin as needed for your frontend domain
app.use(cors({
  origin: 'https://hongeee.xyz'  // allow only your frontend domain
}));

app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the feed_counter table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS feed_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    count INTEGER DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  }
});

// Initialize row if missing
db.get(`SELECT count FROM feed_counter WHERE id = 1`, (err, row) => {
  if (err) {
    console.error("Error checking existing counter:", err);
  } else if (!row) {
    db.run(`INSERT INTO feed_counter (id, count) VALUES (1, 0)`, (err) => {
      if (err) console.error("Failed to initialize counter row:", err);
    });
  }
});

// GET current count
app.get('/counter', (req, res) => {
  db.get(`SELECT count FROM feed_counter WHERE id = 1`, (err, row) => {
    if (err) {
      console.error("Database read error:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ count: row.count });
  });
});

// POST increment count
app.post('/counter', (req, res) => {
  db.run(`UPDATE feed_counter SET count = count + 1 WHERE id = 1`, function(err) {
    if (err) {
      console.error("Database update error:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    db.get(`SELECT count FROM feed_counter WHERE id = 1`, (err2, row) => {
      if (err2) {
        console.error("Database read error after increment:", err2);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ count: row.count });
    });
  });
});

// Listen on all interfaces so it's accessible externally
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SQLite-powered Feeder API running on port ${PORT}`);
});
