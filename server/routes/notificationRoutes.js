const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, notificationController.getNotifications);
router.post('/mark-read', authenticate, notificationController.markAsRead);

module.exports = router;