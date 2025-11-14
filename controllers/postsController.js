let posts = [];

exports.getAllPosts = (req, res) => {
    res.json(posts);
}

exports.createPost = (req, res) => {
    const { id, name, text } = req.body;
    const post = { id, name, text };
    posts.push(post)
    res.status(201).json(post);
}