const pool = require('../db'); // Koneksi database
const jwt = require('jsonwebtoken');

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil user ID dari JWT yang sudah diverifikasi
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update avatar user di database
    await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarUrl, userId]);

    // Ambil data user terbaru
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const updatedUser = result.rows[0];

    // Buat token baru
    const token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Avatar berhasil diperbarui',
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.error('Error update avatar:', error);
    res.status(500).json({ message: 'Gagal memperbarui avatar' });
  }
};
