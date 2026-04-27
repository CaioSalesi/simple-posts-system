const studentService = require('../services/studentService');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { count, rows } = await studentService.getAll({ page, limit });
    res.json({ total: count, page, limit, students: rows });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos.', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const student = await studentService.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Aluno não encontrado.' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aluno.', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email e password são obrigatórios.' });
    }
    const student = await studentService.create({ name, email, password });
    res.status(201).json(student);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar aluno.', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const student = await studentService.update(req.params.id, req.body);
    if (!student) return res.status(404).json({ message: 'Aluno não encontrado.' });
    res.json(student);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar aluno.', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await studentService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Aluno não encontrado.' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir aluno.', error: error.message });
  }
};
