const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const postService = require('../services/postService');

router.get('/', postsController.getAllPosts);
router.get('/search', postsController.searchPosts);

// GET /:id — busca post por ID diretamente do service (fix para compatibilidade)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[route GET /:id] id="${id}"`);
    try {
        const post = await postService.findById(id);
        console.log(`[route GET /:id] resultado:`, post ? 'encontrado' : 'null');
        if (!post) return res.status(404).json({ message: 'Post não encontrado' });
        res.json(post);
    } catch (error) {
        console.error(`[route GET /:id] ERRO:`, error.message);
        res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
    }
});

router.post('/', postsController.createPost);

// PUT /:id — edita post por ID diretamente do service
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[route PUT /:id] id="${id}", body:`, req.body);
    try {
        const updatedPost = await postService.update(id, req.body);
        console.log(`[route PUT /:id] resultado:`, updatedPost ? 'atualizado' : 'null');
        if (!updatedPost) return res.status(404).json({ message: 'Post não encontrado' });
        res.json(updatedPost);
    } catch (error) {
        console.error(`[route PUT /:id] ERRO:`, error.message);
        res.status(500).json({ message: 'Erro ao atualizar post', error: error.message });
    }
});

router.delete('/:id', postsController.deletePostById);

module.exports = router;