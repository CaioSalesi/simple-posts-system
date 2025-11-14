const express = require('express');
const app = express();
const postsRoutes = require('./routes/posts');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/posts', postsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(PORT, () => {
    console.log(`Server app listening on port ${PORT}`)
})