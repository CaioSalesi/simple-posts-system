const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração da conexão
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,      // Nome do banco
  process.env.POSTGRES_USER,     // Usuário
  process.env.POSTGRES_PASSWORD, // Senha
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.EXPOSED_PORT_DB || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    },
    dialectOptions: {
        client_encoding: 'UTF8' 
    }
  }
);

module.exports = sequelize;
