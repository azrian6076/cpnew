const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateAvatar } = require('../controller/avatarController');
const { verifyToken } = require('../middleware/authMiddleware');

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads/'), // Simpan di folder uploads
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Route PUT untuk update avatar
router.put('/update-avatar', verifyToken, upload.single('avatar'), updateAvatar);

module.exports = router;
