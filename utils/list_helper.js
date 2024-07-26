const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const authors = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1;
        return acc;
    }, {});

    const maxBlogs = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);

    return {
        author: maxBlogs,
        blogs: authors[maxBlogs]
    };
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const authors = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
        return acc;
    }, {});

    const maxLikes = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);

    return {
        author: maxLikes,
        likes: authors[maxLikes]
    };
};

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
