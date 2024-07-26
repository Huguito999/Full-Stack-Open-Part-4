const express = require("express");
const Blog = require("../models/blog");
const router = express.Router();
const mongoose = require("mongoose");
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.title || !body.url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

router.delete("/:id", async (req, res) => {
  console.log("Received ID for deletion:", req.params.id);
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(400).json({ error: "Invalid blog ID" });
  }
});
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (likes !== undefined && typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
  }
};

router.put("/:id", updateBlog);

module.exports = router;
