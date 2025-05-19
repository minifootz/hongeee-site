const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const COUNTER_FILE = './counter.json';

// Read current counter value
function readCounter() {
    try {
        const data = fs.readFileSync(COUNTER_FILE, 'utf8');
        return JSON.parse(data).count;
    } catch (err) {
        return 0;
    }
}

// Write new counter value
function writeCounter(count) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count }));
}

// API to get current count
app.get('/counter', (req, res) => {
    const count = readCounter();
    res.json({ count });
});

// API to increment count
app.post('/counter', (req, res) => {
    let count = readCounter() + 1;
    writeCounter(count);
    res.json({ count });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
