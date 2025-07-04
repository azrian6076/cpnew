const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken'); 
const authenticateToken = require('../middleware/authenticate');
const { v4: uuidv4 } = require('uuid'); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.get('/profile', authenticateToken, async (req, res) => {

  const userIdFromToken = req.user.userId;

  try {

    const result = await pool.query(
      'SELECT name, nim, keahlian FROM users u LEFT JOIN mahasiswa m ON u.id = m.user_id WHERE u.id = $1',
      [userIdFromToken]
    );

    if (result.rowCount === 0) {

      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    
 
    res.json(result.rows[0]);

  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect(); 
  
  try {
    const userIdFromToken = req.user.userId;
    const userEmail = req.user.email;
    const userRole = req.user.role;


    const { name, nim, keahlian } = req.body;

    await client.query('BEGIN'); 

    await client.query(
      'UPDATE users SET name = $1 WHERE id = $2',
      [name, userIdFromToken]
    );

    let mahasiswaId;
    const existingMahasiswa = await client.query('SELECT id FROM mahasiswa WHERE user_id = $1', [userIdFromToken]);
    
    if (existingMahasiswa.rowCount > 0) {
      mahasiswaId = existingMahasiswa.rows[0].id;
      await client.query(
        'UPDATE mahasiswa SET nim = $1, keahlian = $2 WHERE user_id = $3',
        [nim, keahlian, userIdFromToken]
      );
    } else {
      mahasiswaId = uuidv4();
      await client.query(
        'INSERT INTO mahasiswa (id, user_id, nim, keahlian) VALUES ($1, $2, $3, $4)',
        [mahasiswaId, userIdFromToken, nim, keahlian]
      );
    }
    
    await client.query('COMMIT'); 


    const newTokenPayload = {
      userId: userIdFromToken,       
      mahasiswaId: mahasiswaId,      
      email: userEmail,
      role: user.role,
      name: name                     
    };
    const newToken = jwt.sign(newTokenPayload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      message: 'Profil berhasil diperbarui', 
      token: newToken,
      user: newTokenPayload,
    });

  } catch (err) {
    await client.query('ROLLBACK'); 
    console.error('[PUT /profile] Transaksi gagal, rollback dilakukan:', err);
    res.status(500).json({ message: 'Gagal memperbarui profil.' });
  } finally {
    client.release(); 
  }
});

module.exports = router;