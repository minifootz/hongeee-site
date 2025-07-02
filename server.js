const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = './feeder.db';

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS feed_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    count INTEGER DEFAULT 0
)`, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  }
});

// Ensure a row exists for counting
db.get(`SELECT count FROM feed_counter WHERE id = 1`, (err, row) => {
  if (err) {
    console.error("Error checking existing counter:", err);
    return;
  }

  if (!row) {
    db.run(`INSERT INTO feed_counter (id, count) VALUES (1, 0)`, (err) => {
      if (err) console.error("Failed to initialize counter row:", err);
    });
  }
});

// GET current counter
app.get('/counter', (req, res) => {
  db.get(`SELECT count FROM feed_counter WHERE id = 1`, (err, row) => {
    if (err) {
      console.error("Database read error:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ count: row.count });
  });
});

// POST to increment counter
app.post('/counter', (req, res) => {
  db.run(`UPDATE feed_counter SET count = count + 1 WHERE id = 1`, function (err) {
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

// Start the server
app.listen(PORT, () => {
  console.log(`SQLite-powered Feeder API running at http://localhost:${PORT}`);
});
