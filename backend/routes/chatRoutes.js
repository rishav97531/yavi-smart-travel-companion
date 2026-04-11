const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chatWithAI);

module.exports = router;
