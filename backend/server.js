require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Инициализация таблицы
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
initDB().catch(err => console.error('Ошибка инициализации базы:', err));

// Получение отзывов
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, message, created_at FROM reviews ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Ошибка при получении отзывов');
  }
});

// Сохранение отзыва
app.post('/api/reviews', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('Имя и сообщение обязательны');

  try {
    await pool.query('INSERT INTO reviews (name, message) VALUES ($1, $2)', [name, message]);
    res.status(201).send('Отзыв сохранён');
  } catch (err) {
    res.status(500).send('Ошибка при сохранении');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
