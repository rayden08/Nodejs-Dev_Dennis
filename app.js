const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authController = require('./controllers/authController');
const itemController = require('./controllers/itemController');
const compareController = require('./controllers/compareController');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// API
app.post('/api/login', authController.login);

app.get('/api/items', itemController.list);
app.post('/api/items', itemController.create);
app.get('/api/items/:id', itemController.get);
app.put('/api/items/:id', itemController.update);
app.delete('/api/items/:id', itemController.remove);

app.post('/api/compare', compareController.compare);

// Fallback to index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tetap jalankan port untuk kebutuhan running / testing di lokal (localhost)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// WAJIB UNTUK VERCEL: Mengeksport instance app Express agar dibaca sebagai Serverless Function
module.exports = app;
