const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require("./controllers/login");
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message);
    });

module.exports = app;
