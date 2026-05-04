const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const SAFE_ATTRS = ['id', 'name', 'email', 'createdAt', 'updatedAt'];

exports.getAll = ({ page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  return Student.findAndCountAll({
    attributes: SAFE_ATTRS,
    order: [['name', 'ASC']],
    limit,
    offset,
  });
};

exports.findById = (id) =>
  Student.findByPk(id, { attributes: SAFE_ATTRS });

exports.findByEmail = (email) =>
  Student.findOne({ where: { email } });

exports.create = async ({ name, email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const student = await Student.create({ name, email, password: hash });
  return Student.findByPk(student.id, { attributes: SAFE_ATTRS });
};

exports.update = async (id, { name, email, password }) => {
  const student = await Student.findByPk(id);
  if (!student) return null;
  if (name) student.name = name;
  if (email) student.email = email;
  if (password) student.password = await bcrypt.hash(password, 10);
  await student.save();
  return Student.findByPk(id, { attributes: SAFE_ATTRS });
};

exports.delete = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) return false;
  await student.destroy();
  return true;
};
