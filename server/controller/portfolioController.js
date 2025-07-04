const db = require('../db');
const fs = require('fs');
const path = require('path');

exports.getAllPortfolios = async (req, res) => {
  try {
    const mahasiswaId = req.user.mahasiswaId;
    if (!mahasiswaId) {
      return res.status(401).json({ msg: 'Akses ditolak: Token tidak valid untuk mahasiswa.' });
    }
    

    const { rows } = await db.query(
      'SELECT * FROM portofolio WHERE mahasiswa_id = $1 ORDER BY created_at DESC', 
      [mahasiswaId]
    );
    res.json(rows);

  } catch (err) {
    console.error('Error di getAllPortfolios:', err);
    res.status(500).send('Server Error');
  }
};


exports.createPortfolio = async (req, res) => {
  try {
    const mahasiswaId = req.user.mahasiswaId;
    if (!mahasiswaId) {
      return res.status(400).json({ msg: 'Gagal membuat portofolio: Data mahasiswa tidak valid pada token Anda.' });
    }
    
    const { judul, deskripsi, kategori, tautan } = req.body;
    if (!judul || !deskripsi || !kategori) {
        return res.status(400).json({ msg: 'Judul, Deskripsi, dan Kategori wajib diisi.' });
    }

    const file_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const { rows } = await db.query(
      `INSERT INTO portofolio (mahasiswa_id, kategori, judul, deskripsi, file_url, status_verifikasi, tautan)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING *`,
      [mahasiswaId, kategori, judul, deskripsi, file_url, tautan || null] 
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error('Error di createPortfolio:', err);
    res.status(500).send('Server Error');
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const mahasiswaId = req.user.mahasiswaId;
    

    const { judul, deskripsi, tautan } = req.body;

    const oldPortfolioResult = await db.query(
        'SELECT file_url FROM portofolio WHERE id = $1 AND mahasiswa_id = $2', 
        [id, mahasiswaId]
    );
    if (oldPortfolioResult.rowCount === 0) {
        return res.status(404).json({ msg: 'Portofolio tidak ditemukan atau Anda tidak berhak mengubahnya.' });
    }
    const oldFileUrl = oldPortfolioResult.rows[0].file_url;
    
    let newFileUrl = oldFileUrl;
    if (req.file) {
      newFileUrl = `/uploads/${req.file.filename}`;
      if (oldFileUrl) {
        fs.unlink(path.join(__dirname, '..', oldFileUrl), (err) => {
            if (err) console.error("Gagal menghapus file lama:", err);
        });
      }
    }

 
    const { rows } = await db.query(
      `UPDATE portofolio SET judul = $1, deskripsi = $2, file_url = $3, tautan = $4
       WHERE id = $5 AND mahasiswa_id = $6 RETURNING *`,
      [judul, deskripsi, newFileUrl, tautan || null, id, mahasiswaId]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error('Error di updatePortfolio:', err);
    res.status(500).send('Server Error');
  }
};


exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const mahasiswaId = req.user.mahasiswaId;
    const result = await db.query(
      'DELETE FROM portofolio WHERE id = $1 AND mahasiswa_id = $2 RETURNING file_url', 
      [id, mahasiswaId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Portofolio tidak ditemukan.' });
    }

    const fileUrl = result.rows[0].file_url;
    if (fileUrl) {
      fs.unlink(path.join(__dirname, '..', fileUrl), (err) => {
        if (err) console.error("Gagal menghapus file:", err);
      });
    }

    res.json({ msg: 'Portofolio berhasil dihapus.' });

  } catch (err) {
    console.error('Error di deletePortfolio:', err);
    res.status(500).send('Server Error');
  }
};