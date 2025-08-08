require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://frontend'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly include all methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// Verify DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('🚨 Database connection error:', err);
    process.exit(1);
  }
  console.log('💾 Database connected successfully');
  release();
});

// CRUD Endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM funky_items ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('🚨 Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/items', async (req, res) => {
  const { name, description, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO funky_items (name, description, color) VALUES ($1, $2, $3) RETURNING *',
      [name, description, color || '#4CAF50']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('🚨 Creation error:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// UPDATE endpoint
app.put('/api/items/:id', async (req, res) => {
  const { name, description, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const { rows } = await pool.query(
      `UPDATE funky_items 
       SET name = $1, description = $2, color = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING *`,
      [name, description, color, req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('🚨 Update error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE endpoint
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM funky_items WHERE id = $1',
      [req.params.id]
    );
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(204).end();
  } catch (err) {
    console.error('🚨 Deletion error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌈 Funky backend jamming on port ${PORT}`);
});
