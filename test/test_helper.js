const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First blog",
    author: "Author 1",
    url: "http://example.com/1",
    likes: 1,
  },
  {
    title: "Second blog",
    author: "Author 2",
    url: "http://example.com/2",
    likes: 2,
  },
];

const nonExistentId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "author",
    url: "http://example.com",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistentId,
};
