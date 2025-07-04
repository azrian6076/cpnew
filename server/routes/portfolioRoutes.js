const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const portfolioController = require('../controller/portfolioController');
const authenticate = require('../middleware/authenticate');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'portfolio-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
 
    return cb(null, true);
  }

  cb(new Error('Tipe file tidak didukung! Hanya gambar (JPG, PNG) dan PDF yang diizinkan.'), false);
};


const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


const uploadMiddleware = upload.single('portofolioFile');


router.get('/', authenticate, portfolioController.getAllPortfolios);


router.post('/', authenticate, uploadMiddleware, portfolioController.createPortfolio);


router.put('/:id', authenticate, uploadMiddleware, portfolioController.updatePortfolio);

router.delete('/:id', authenticate, portfolioController.deletePortfolio);



module.exports = router;