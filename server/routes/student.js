const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, studentController.getAllStudents);

router.get('/:userId/profile', authenticate, studentController.getStudentProfileById);

router.get('/:userId/portfolio', authenticate, studentController.getStudentPortfolioById);

module.exports = router;