const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getAllPosts); 
router.get('/search', postsController.searchPosts);

router.get('/:id', postsController.getPostById); 
router.post('/', postsController.createPost); 
router.put('/:id', postsController.updatePostById); 
router.delete('/:id', postsController.deletePostById); 

module.exports = router;