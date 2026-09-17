const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'salon_db',
  password: '12345', 
  port: 5432,
});

// --- SERVICES APIs ---
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', async (req, res) => {
  const { name, price, duration } = req.body;
  if (!name || price <= 0 || duration <= 0) {
    return res.status(400).json({ error: 'Invalid service details' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *',
      [name, price, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  const { name, price, duration } = req.body;
  try {
    await pool.query('UPDATE services SET name=$1, price=$2, duration=$3 WHERE id=$4', [name, price, duration, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- APPOINTMENTS APIs ---
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, s.name as service_name 
      FROM appointments a 
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { customer_name, customer_phone, service_id, appointment_date, appointment_time, notes } = req.body;
  
  if (!customer_name || !customer_phone || !service_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  try {
    // Conflict check business rule
    const conflict = await pool.query(
      'SELECT * FROM appointments WHERE service_id = $1 AND appointment_date = $2 AND appointment_time = $3',
      [service_id, appointment_date, appointment_time]
    );
    
    if (conflict.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot already booked for this service' });
    }

    const result = await pool.query(
      'INSERT INTO appointments (customer_name, customer_phone, service_id, appointment_date, appointment_time, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customer_name, customer_phone, service_id, appointment_date, appointment_time, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/appointments/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));