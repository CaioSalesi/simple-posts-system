const postsController = require('../controllers/postsController.js');
const postService = require('../services/postService');

// Mock do Service para não tocar no banco de dados real durante o teste do controller
jest.mock('../services/postService');

let req, res;

beforeEach(() => {
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  };
  jest.clearAllMocks();
});

describe('Posts Controller', () => {

  test('Cria um post com sucesso', async () => {
    // Dados corrigidos para bater com seu Model (title, content, author)
    req.body = {
      title: "Aula de Node",
      content: "Conteúdo do Tech Challenge",
      author: "Victor"
    };

    // Simula o retorno de sucesso do Service
    postService.create.mockResolvedValue({ id: "uuid-123", ...req.body });

    await postsController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      title: "Aula de Node"
    }));
  });

  test('Edita um post existente', async () => {
    req.params = { id: "uuid-123" };
    req.body = { title: "Título Atualizado" };

    // Simula que o service encontrou e atualizou o post
    postService.update.mockResolvedValue({ id: "uuid-123", title: "Título Atualizado" });

    await postsController.updatePostById(req, res);

    expect(res.json).toHaveBeenCalled();
    expect(postService.update).toHaveBeenCalledWith("uuid-123", req.body);
  });

  test('Deleta um post existente', async () => {
    req.params = { id: "uuid-123" };

    // Simula que o service deletou com sucesso (retornou true)
    postService.delete.mockResolvedValue(true);

    await postsController.deletePostById(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  test('Retorna 404 ao tentar deletar post inexistente', async () => {
    req.params = { id: "id-que-nao-existe" };
    postService.delete.mockResolvedValue(null);

    await postsController.deletePostById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post não encontrado" });
  });
});