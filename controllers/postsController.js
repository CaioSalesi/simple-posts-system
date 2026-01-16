const postService = require('../services/postService');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAll();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await postService.getById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post não encontrado" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ message: "Campos obrigatórios: title, content, author" });
        }

        const post = await postService.create({ title, content, author });
        res.status(201).json(post);
    } catch (error) {
        const status = error.name === 'SequelizeValidationError' ? 400 : 500;
        res.status(status).json({ message: 'Erro ao criar post', error: error.message });
    }
};

exports.updatePostById = async (req, res) => {
    try {
        const updatedPost = await postService.update(req.params.id, req.body);
        if (!updatedPost) return res.status(404).json({ message: "Post não encontrado" });
        res.json(updatedPost);
    } catch (error) {
        const status = error.name === 'SequelizeValidationError' ? 400 : 500;
        res.status(status).json({ message: 'Erro ao atualizar post', error: error.message });
    }
};

exports.deletePostById = async (req, res) => {
    try {
        const deleted = await postService.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Post não encontrado" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar post', error: error.message });
    }
};

exports.searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Parâmetro 'q' é obrigatório." });

        const posts = await postService.search(q);
        res.json({ query: q, count: posts.length, results: posts });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar posts', error: error.message });
    }
};