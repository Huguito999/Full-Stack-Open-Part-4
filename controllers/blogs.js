const express = require('express');
const Blog = require('../models/blog');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const blog = new Blog(req.body);

    try {
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ error: 'Bad request' });
    }
});

module.exports = router;
