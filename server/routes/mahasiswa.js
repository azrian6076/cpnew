const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Sesi tidak valid, ID pengguna tidak ditemukan.' });
    }

    const query = `
      SELECT
        u.id AS "userId",
        u.name,
        u.email,
        u.role,
        u.avatar,
        m.id AS "mahasiswaId",
        m.nim,
        m.keahlian
      FROM users u
      LEFT JOIN mahasiswa m ON u.id = m.user_id
      WHERE u.id = $1;
    `;
    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    
    res.json(result.rows[0]);

  } catch (err) {
    console.error('[GET /profile] Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.put(
  '/profile',
  authenticateToken,
  [ 
    body('name').notEmpty().withMessage('Nama tidak boleh kosong').trim(),
    body('nim').optional({ checkFalsy: true }).isString().trim(),
    body('keahlian').optional({ checkFalsy: true }).isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await pool.connect();
    
    try {
      const userId = req.user.userId || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: 'Sesi tidak valid, ID pengguna tidak ditemukan di token.' });
      }

      const { name, nim, keahlian } = req.body;

      await client.query('BEGIN');

 
      await client.query(
        'UPDATE users SET name = $1 WHERE id = $2',
        [name, userId]
      );


      const mahasiswaQuery = `
        INSERT INTO mahasiswa (user_id, nim, keahlian)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) 
        DO UPDATE SET
          nim = EXCLUDED.nim,
          keahlian = EXCLUDED.keahlian
        RETURNING id;
      `;
      const mahasiswaResult = await client.query(mahasiswaQuery, [userId, nim || null, keahlian || null]);
      const mahasiswaId = mahasiswaResult.rows[0].id;

      await client.query('COMMIT');


      const newTokenPayload = {
        userId: userId,
        mahasiswaId: mahasiswaId,
        email: req.user.email,
        role: req.user.role,
        name: name,
        nim: nim,             
        keahlian: keahlian      
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
      if (err.code === '23505' && err.constraint === 'mahasiswa_nim_key') {
         return res.status(409).json({ message: 'NIM tersebut sudah terdaftar. Silakan gunakan NIM lain.' });
      }
      res.status(500).json({ message: 'Gagal memperbarui profil.' });
    } finally {
      client.release();
    }
  }
);

module.exports = router;