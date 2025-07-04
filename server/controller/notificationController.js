const db = require('../db');


exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = `
            SELECT id, message, link, is_read, created_at 
            FROM notifications 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 10;
        `;
        const { rows } = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        console.error("Error getting notifications:", err);
        res.status(500).json({ message: "Gagal mengambil notifikasi." });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
            [userId]
        );
        res.status(200).json({ message: "Notifikasi ditandai sebagai telah dibaca." });
    } catch (err) {
        console.error("Error marking notifications as read:", err);
        res.status(500).json({ message: "Gagal memperbarui notifikasi." });
    }
};