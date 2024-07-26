const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog"); 
const helper = require("./test_helper"); 

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body;
  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
    expect(blog._id).not.toBeDefined();
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog",
    author: "New Author",
    url: "http://newblog.com",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((r) => r.title);
  expect(titles).toContain("New Blog");
});

test("if likes property is missing, it will default to 0", async () => {
  const newBlog = {
    title: "Blog Without Likes",
    author: "Author Without Likes",
    url: "http://blogwithoutlikes.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = blogsAtEnd.find(
    (blog) => blog.title === "Blog Without Likes"
  );
  expect(addedBlog.likes).toBe(0);
});

test("if title or url property is missing, the backend responds with 400 Bad Request", async () => {
  let response = await api
    .post("/api/blogs")
    .send({
      author: "Author Without Title",
      url: "http://blogwithouttitle.com",
    })
    .expect(400);

  response = await api
    .post("/api/blogs")
    .send({
      title: "Blog Without URL",
      author: "Author Without URL",
    })
    .expect(400);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  console.log("Deleting blog with ID:", blogToDelete.id);

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const ids = blogsAtEnd.map((b) => b.id);
  expect(ids).not.toContain(blogToDelete.id);
});

describe("updating a blog", () => {
  test("succeeds with valid data", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlogData = {
      likes: blogToUpdate.likes + 1,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(updatedBlogData.likes);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    expect(updatedBlog.likes).toBe(updatedBlogData.likes);
  });

  test("fails with status code 400 if data invalid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const invalidData = {
      likes: "invalid data",
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidData)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    const unmodifiedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    expect(unmodifiedBlog.likes).toBe(blogToUpdate.likes);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const nonExistentId = await helper.nonExistentId();

    const validData = {
      likes: 10,
    };

    await api.put(`/api/blogs/${nonExistentId}`).send(validData).expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
