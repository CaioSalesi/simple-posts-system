let posts = [];

exports.getAllPosts = (req, res) => {
    res.json(posts);
}

exports.createPost = (req, res) => {
    const { id, name, text } = req.body;
    if (posts.some(item => item.id === id))
        return res.status(401).json("ID deve ser única");
    const post = { id, name, text };
    posts.push(post)
    res.status(201).json(post);
}