const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'classhub-secret-key';

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

const teacherOnly = (req, res, next) => {
  if (req.user?.role !== 'teacher') {
    return res.status(403).json({ message: 'Acesso restrito a professores.' });
  }
  next();
};

module.exports = { authenticate, teacherOnly, JWT_SECRET };
