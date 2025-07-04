const express = require('express');
const router = express.Router();
const collaborationController = require('../controller/collaborationController');
const authenticate = require('../middleware/authenticate');


router.post('/', authenticate, collaborationController.createCollaboration);
router.get('/', authenticate, collaborationController.getAllCollaborations);


router.get('/:id', authenticate, collaborationController.getCollaborationById);
router.put('/:id/respond', authenticate, collaborationController.respondToCollaboration);

module.exports = router;