const express = require('express');
const router = express.Router();
const db = require('../db'); // Sesuaikan path db

// Industri mengirim undangan kolaborasi
router.post('/', async (req, res) => {
  const { judul_proyek, deskripsi, pesan_detail, invited_student_user_id, industry_user_id } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO kolaborasi (judul_proyek, deskripsi, pesan_detail, invited_student_user_id, industry_user_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW()) RETURNING *`,
      [judul_proyek, deskripsi, pesan_detail, invited_student_user_id, industry_user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Gagal kirim undangan:", err);
    res.status(500).json({ error: 'Gagal menyimpan undangan' });
  }
});

// Mahasiswa melihat undangan yang masuk
router.get('/mahasiswa/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM kolaborasi WHERE invited_student_user_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Gagal ambil undangan mahasiswa:", err);
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

// Mahasiswa menerima/menolak undangan
router.put('/:id/respond', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' atau 'rejected'

  try {
    const result = await db.query(
      `UPDATE kolaborasi SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Gagal update status:", err);
    res.status(500).json({ error: 'Gagal mengubah status' });
  }
});

module.exports = router;
