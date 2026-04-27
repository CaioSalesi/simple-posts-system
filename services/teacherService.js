const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const { Op } = require('sequelize');

const SAFE_ATTRS = ['id', 'name', 'email', 'createdAt', 'updatedAt'];

exports.getAll = ({ page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  return Teacher.findAndCountAll({
    attributes: SAFE_ATTRS,
    order: [['name', 'ASC']],
    limit,
    offset,
  });
};

exports.findById = (id) =>
  Teacher.findByPk(id, { attributes: SAFE_ATTRS });

exports.findByEmail = (email) =>
  Teacher.findOne({ where: { email } });

exports.create = async ({ name, email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const teacher = await Teacher.create({ name, email, password: hash });
  return Teacher.findByPk(teacher.id, { attributes: SAFE_ATTRS });
};

exports.update = async (id, { name, email, password }) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return null;
  if (name) teacher.name = name;
  if (email) teacher.email = email;
  if (password) teacher.password = await bcrypt.hash(password, 10);
  await teacher.save();
  return Teacher.findByPk(id, { attributes: SAFE_ATTRS });
};

exports.delete = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return false;
  await teacher.destroy();
  return true;
};
