const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

test("creation fails with proper statuscode and message if username already taken", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "root",
    name: "Superuser",
    password: "password123",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(result.body.error).toContain("Username must be unique");

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test("creation fails with proper statuscode and message if username is too short", async () => {
  const newUser = {
    username: "ro",
    name: "Superuser",
    password: "password123",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(result.body.error).toContain(
    "Username and password must each be at least 3 characters long"
  );
});

test("creation fails with proper statuscode and message if password is too short", async () => {
  const newUser = {
    username: "rooter",
    name: "Superuser",
    password: "pw",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(result.body.error).toContain(
    "Username and password must each be at least 3 characters long"
  );
});

test("creation fails with proper statuscode and message if username or password is missing", async () => {
  const newUserNoUsername = {
    name: "NoUsername",
    password: "password123",
  };

  const resultNoUsername = await api
    .post("/api/users")
    .send(newUserNoUsername)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(resultNoUsername.body.error).toContain(
    "Username and password are required"
  );

  const newUserNoPassword = {
    username: "nopassword",
    name: "NoPassword",
  };

  const resultNoPassword = await api
    .post("/api/users")
    .send(newUserNoPassword)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(resultNoPassword.body.error).toContain(
    "Username and password are required"
  );
});

afterAll(() => {
  mongoose.connection.close();
});
