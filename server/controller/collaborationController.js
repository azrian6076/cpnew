const db = require('../db');
const { sendCollaborationInvite } = require('../utils/mailer');


exports.createCollaboration = async (req, res) => {
    const lecturerUserId = req.user.userId; 
    const lecturerName = req.user.name;
    const { invitedStudentUserId, judulProyek, deskripsi, pesanDetail } = req.body;

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const studentResult = await client.query(
            "SELECT email FROM users WHERE id = $1 AND role = 'student'",
            [invitedStudentUserId]
        );
        if (studentResult.rowCount === 0) {
            throw new Error("Mahasiswa yang dipilih tidak valid.");
        }
        const invitedStudentEmail = studentResult.rows[0].email;

        const collabQuery = `
            INSERT INTO collaborations (lecturer_user_id, invited_student_user_id, judul_proyek, deskripsi, pesan_detail)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, judul_proyek
        `;
        const collabResult = await client.query(collabQuery, [lecturerUserId, invitedStudentUserId, judulProyek, deskripsi, pesanDetail]);
        const newCollab = collabResult.rows[0];

        const notificationMessage = `Anda diundang oleh ${lecturerName} untuk berkolaborasi dalam proyek "${newCollab.judul_proyek}".`;
        const notificationLink = `/student/kolaborasi/${newCollab.id}`; 
        
        const notificationQuery = `
            INSERT INTO notifications (user_id, message, link) VALUES ($1, $2, $3)
        `;
        await client.query(notificationQuery, [invitedStudentUserId, notificationMessage, notificationLink]);
        
        await client.query('COMMIT');
        
        sendCollaborationInvite(invitedStudentEmail, lecturerName, judulProyek);

        res.status(201).json({ message: 'Kolaborasi berhasil diajukan dan notifikasi telah dikirim.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error creating collaboration:", err);
        res.status(500).json({ message: err.message || "Gagal mengajukan kolaborasi." });
    } finally {
        client.release();
    }
};


exports.getAllCollaborations = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id, c.judul_proyek, c.deskripsi, c.status,
                lecturer.name AS lecturer_name,
                student.name AS student_name
            FROM collaborations c
            JOIN users lecturer ON c.lecturer_user_id = lecturer.id
            JOIN users student ON c.invited_student_user_id = student.id
            ORDER BY c.created_at DESC;
        `;
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error getting collaborations:", err);
        res.status(500).json({ message: "Gagal mengambil data kolaborasi." });
    }
};



exports.getCollaborationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; 


    const query = `
      SELECT 
        c.id, c.judul_proyek, c.deskripsi, c.pesan_detail, c.status,
        lecturer.name AS lecturer_name
      FROM collaborations c
      JOIN users lecturer ON c.lecturer_user_id = lecturer.id
      WHERE c.id = $1 AND c.invited_student_user_id = $2;
    `;
    const { rows } = await db.query(query, [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Undangan kolaborasi tidak ditemukan atau bukan untuk Anda.' });
    }
    res.json(rows[0]);

  } catch (err) {
    console.error('Error di getCollaborationById:', err);
    res.status(500).send('Server Error');
  }
};


exports.respondToCollaboration = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.userId; 
    const { status } = req.body; 

    if (status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ msg: 'Status respons tidak valid.' });
    }

    const { rows } = await db.query(
      `UPDATE collaborations 
       SET status = $1 
       WHERE id = $2 AND invited_student_user_id = $3
       RETURNING *`,
      [status, id, userId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ msg: 'Gagal memperbarui. Undangan tidak ditemukan atau bukan untuk Anda.' });
    }
    
  

    res.json({ message: `Anda telah ${status === 'accepted' ? 'menerima' : 'menolak'} undangan.` });

  } catch (err) {
    console.error('Error di respondToCollaboration:', err);
    res.status(500).send('Server Error');
  }
};