require('dotenv').config();
const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/posts', postsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
})

const startServer = async () => {
    try {
        // Testa a conexÃ£o com o banco
        await sequelize.authenticate();
        console.log('âœ… Conectado ao PostgreSQL');

        // Sincroniza os models (cria/atualiza tabelas)
        await sequelize.sync({ alter: true });
        console.log('âœ… Tabelas sincronizadas');

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`ðŸš€ Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('âŒ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;