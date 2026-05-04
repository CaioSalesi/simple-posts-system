require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');

async function seed() {
  await sequelize.authenticate();
  console.log('✅ Conectado ao PostgreSQL');

  await sequelize.sync({ alter: true });
  console.log('✅ Tabelas sincronizadas (teachers, students, posts)');

  const password = await bcrypt.hash('Pass@123', 10);
  const [teacher, created] = await Teacher.findOrCreate({
    where: { email: 'admin@email.com' },
    defaults: { name: 'Admin', email: 'admin@email.com', password },
  });

  if (created) {
    console.log('✅ Professor admin criado → email: admin | senha: Pass@123');
  } else {
    console.log('ℹ️  Professor admin já existe');
  }

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
