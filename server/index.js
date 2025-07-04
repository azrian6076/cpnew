// ISI FILE: server/index.js (Dengan Perbaikan)

const express = require('express');
const cors = require('cors');
const path = require('path');

// Impor Routes Anda
const authRoutes = require('./routes/auth');
const mahasiswaRoutes = require('./routes/mahasiswa');
const portfolioRoutes = require('./routes/portfolioRoutes');
const studentRoutes = require('./routes/student'); // <-- 1. TAMBAHKAN IMPORT INI
const collaborationRoutes = require('./routes/collaborationRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const avatarRoutes = require('./routes/avatar');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware untuk menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/kolaborasi', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', avatarRoutes);
app.use('/api/kolaborasi', require('./routes/kolaborasi'));

app.use('/uploads', express.static('uploads'));
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});