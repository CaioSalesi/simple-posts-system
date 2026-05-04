const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const teacherService = require('../services/teacherService');
const studentService = require('../services/studentService');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'email, password e role são obrigatórios.' });
  }

  try {
    let user = null;

    if (role === 'teacher') {
      user = await teacherService.findByEmail(email);
    } else if (role === 'student') {
      user = await studentService.findByEmail(email);
    } else {
      return res.status(400).json({ message: 'role deve ser "teacher" ou "student".' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login.', error: error.message });
  }
};
