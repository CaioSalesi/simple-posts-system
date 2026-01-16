const postService = require('../services/postService');
const Post = require('../models/Post');

// Simula o modelo Post do Sequelize
jest.mock('../models/Post');

describe('PostService', () => {
    it('deve retornar uma lista de posts', async () => {
        const mockPosts = [
            { id: '1', title: 'Post Teste', content: 'Conteúdo', author: 'Autor' }
        ];
        
        // Simula o comportamento do findAll do Sequelize
        Post.findAll.mockResolvedValue(mockPosts);

        const result = await postService.getAll();
        
        expect(result).toEqual(mockPosts);
        expect(Post.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve criar um novo post com sucesso', async () => {
        const newPost = { title: 'Novo Post', content: 'Conteúdo', author: 'Victor' };
        Post.create.mockResolvedValue({ id: 'uuid-gerado', ...newPost });

        const result = await postService.create(newPost);

        expect(result.title).toBe('Novo Post');
        expect(Post.create).toHaveBeenCalledWith(newPost);
    });
});