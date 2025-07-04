// ISI FILE: server/utils/mailer.js

const nodemailer = require('nodemailer');

// Pastikan Anda sudah menginstall 'dotenv' dan membuat file .env
// npm install dotenv
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gunakan App Password dari Google
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendCollaborationInvite = async (toEmail, fromLecturerName, projectName) => {
    const mailOptions = {
        from: `"E-Portfolio System" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Undangan Kolaborasi Proyek: ${projectName}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #00796B;">Undangan Kolaborasi Baru</h2>
                <p>Halo!</p>
                <p>Anda telah diundang oleh <strong>${fromLecturerName}</strong> untuk berkolaborasi dalam proyek baru di Sistem E-Portfolio.</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <h3>Detail Proyek:</h3>
                <p style="margin-left: 20px;"><strong>Nama Proyek:</strong> ${projectName}</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p>Untuk menerima atau menolak undangan ini, silakan login ke akun E-Portfolio Anda dan periksa halaman kolaborasi untuk detail lebih lanjut.</p>
                <br>
                <p>Terima kasih,</p>
                <p><strong>Tim Sistem E-Portfolio</strong></p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email undangan berhasil terkirim ke: ${toEmail}`);
    } catch (error) {
        console.error(`❌ Gagal mengirim email ke ${toEmail}:`, error);
    }
};

module.exports = { sendCollaborationInvite };