const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getAllPosts); // Lista de Posts
router.get('/:id', postsController.getPostById); // Postagem por ID
router.post('/', postsController.createPost); // Criação de Postagens
router.put('/:id', postsController.updatePostById); // Atualização de Post por Id
router.delete('/:id', postsController.deletePostById); // Atualização de Post por Id

module.exports = router;