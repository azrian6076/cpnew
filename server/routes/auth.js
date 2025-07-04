// ISI FILE: server/routes/auth.js (Dengan Perbaikan)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticate'); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.password, 
        u.role,
        u.avatar,
        m.id AS "mahasiswaId",
        m.nim,
        m.keahlian
      FROM users u
      LEFT JOIN mahasiswa m ON u.id = m.user_id
      WHERE u.email = $1;
    `;
    const userResult = await pool.query(query, [email]);

    if (userResult.rowCount === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }


    const tokenPayload = {
      userId: user.id, 
      mahasiswaId: user.mahasiswaId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      nim: user.nim,
      keahlian: user.keahlian
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });


    res.json({ 
      message: 'Login berhasil', 
      token, 
      user: tokenPayload 
    });


  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;