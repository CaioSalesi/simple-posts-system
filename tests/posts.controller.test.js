const postsController = require('../controllers/postsController.js');

let req, res;

beforeEach(() => {
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  };
});

describe('Posts Controller', () => {

  test('Cria um post com sucesso', () => {
    req.body = { id: "1", name: "Teste", text: "Conteúdo" };

    postsController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('Edita um post existente', () => {
    req.params = { id: "1" };
    req.body = { name: "Novo nome", text: "Novo texto" };

    postsController.updatePostById(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  test('Deleta um post existente', () => {
    req.params = { id: "1" };

    postsController.deletePostById(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

});
