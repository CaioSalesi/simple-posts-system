const Post = require('../models/Post');
const { Op } = require('sequelize');

class PostService {
    async getAll() {
        return await Post.findAll({ order: [['createdAt', 'DESC']] });
    }

    async findById(id) {
        return await Post.findByPk(id);
    }

    // alias mantido para compatibilidade com o controller
    async getById(id) {
        return this.findById(id);
    }

    async create(data) {
        return await Post.create(data);
    }

    async update(id, data) {
        const post = await Post.findByPk(id);
        if (!post) return null;
        return await post.update(data);
    }

    async delete(id) {
        const post = await Post.findByPk(id);
        if (!post) return null;
        return await post.destroy();
    }

    async search(query) {
        const decodedQuery = decodeURIComponent(query);
        return await Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${decodedQuery}%` } },
                    { content: { [Op.iLike]: `%${decodedQuery}%` } },
                    { author: { [Op.iLike]: `%${decodedQuery}%` } }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = new PostService();