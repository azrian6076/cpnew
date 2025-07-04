const db = require('../db');

// FUNGSI 1: Mengambil semua mahasiswa (untuk dashboard dosen)
exports.getAllStudents = async (req, res) => {
  try {
    const query = `
      SELECT u.id AS "userId", u.name, u.email, u.role, u.avatar,
             m.id AS "mahasiswaId", m.nim, m.keahlian
      FROM users u
      LEFT JOIN mahasiswa m ON u.id = m.user_id
      WHERE u.role = 'student'
      ORDER BY u.name ASC;
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error di getAllStudents:', err);
    res.status(500).send('Server Error');
  }
};

// FUNGSI 2: Mengambil profil SATU mahasiswa berdasarkan ID
exports.getStudentProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT u.name, u.email, u.avatar, m.nim, m.keahlian
      FROM users u
      LEFT JOIN mahasiswa m ON u.id = m.user_id
      WHERE u.id = $1 AND u.role = 'student';
    `;
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Profil mahasiswa tidak ditemukan.' });
    }
    res.json(rows[0]);

  } catch (err) {
    console.error('Error di getStudentProfileById:', err);
    res.status(500).send('Server Error');
  }
};

// FUNGSI 3: Mengambil SEMUA portofolio milik SATU mahasiswa
exports.getStudentPortfolioById = async (req, res) => {
  try {
    const { userId } = req.params;

    const mahasiswaResult = await db.query('SELECT id FROM mahasiswa WHERE user_id = $1', [userId]);
    if (mahasiswaResult.rowCount === 0) {
      return res.json([]); 
    }
    const mahasiswaId = mahasiswaResult.rows[0].id;
    
    const { rows } = await db.query(
      'SELECT * FROM portofolio WHERE mahasiswa_id = $1 ORDER BY created_at DESC',
      [mahasiswaId]
    );
    res.json(rows);

  } catch (err) {
    console.error('Error di getStudentPortfolioById:', err);
    res.status(500).send('Server Error');
  }
};