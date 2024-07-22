require('dotenv').config();

const PORT = process.env.PORT || 3003;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/bloglist';

module.exports = {
    MONGO_URL,
    PORT
};
