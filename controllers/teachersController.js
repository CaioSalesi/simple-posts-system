const teacherService = require('../services/teacherService');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { count, rows } = await teacherService.getAll({ page, limit });
    res.json({ total: count, page, limit, teachers: rows });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professores.', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const teacher = await teacherService.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Professor não encontrado.' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professor.', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email e password são obrigatórios.' });
    }
    const teacher = await teacherService.create({ name, email, password });
    res.status(201).json(teacher);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar professor.', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const teacher = await teacherService.update(req.params.id, req.body);
    if (!teacher) return res.status(404).json({ message: 'Professor não encontrado.' });
    res.json(teacher);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar professor.', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await teacherService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Professor não encontrado.' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir professor.', error: error.message });
  }
};
