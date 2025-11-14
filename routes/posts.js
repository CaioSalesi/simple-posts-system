const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');


router.post('/', postsController.createPost);
router.get('/', postsController.getAllPosts);

module.exports = router;