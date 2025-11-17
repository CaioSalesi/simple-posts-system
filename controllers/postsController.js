let posts = [];

exports.getAllPosts = (req, res) => {
    res.json(posts);
}
exports.getPostById = (req, res) => {
    const id = req.params.id;
    const post = posts.find(p => p.id === id);

    if (!post)
        return res.status(404).json("Post não encontrado");

    res.json(post);
}
exports.createPost = (req, res) => {
    const { id, name, text } = req.body;

    if (posts.some(p => p.id === id))
        return res.status(400).json("ID deve ser única");
    if (typeof id !== "string" || typeof name !== "string" || typeof text !== "string")
        return res.status(400).json("Os todos os dados devem ser passados como String");
    
    const post = { id, name, text };
    posts.push(post)

    res.status(201).json(post);
}
exports.updatePostById = (req, res) => {
    const id = req.params.id;
    const { name, text } = req.body;
    const post = posts.find(p => p.id === id);

    if (typeof name !== "string" || typeof text !== "string")
        return res.status(400).json("Os todos os dados devem ser passados como String");
    if (!post)
        return res.status(404).json("Post não encontrado");

    post.name = name;
    post.text = text;
    res.json(post);
}
exports.deletePostById = (req, res) => {
    const id = req.params.id;
    const index = posts.findIndex(p => p.id === id);

    if (index === -1)
        return res.status(404).send("Post não encontrado")

    posts.splice(index, 1);
    res.status(204).send();
}