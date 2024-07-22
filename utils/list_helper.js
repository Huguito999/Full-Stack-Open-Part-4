const _ = require('lodash');
const dummy = (blogs) => {
    return 1;
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const favorite = blogs.reduce((prev, curr) => {
        return curr.likes > prev.likes ? curr : prev;
    });

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const authorBlogCount = _.countBy(blogs, 'author');


    const mostBlogsAuthor = _.maxBy(
        Object.entries(authorBlogCount),
        ([author, count]) => count
    );

    return {
        author: mostBlogsAuthor[0],
        blogs: mostBlogsAuthor[1]
    };
};
const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const groupedByAuthor = _.groupBy(blogs, 'author');

    const authorLikes = _.mapValues(groupedByAuthor, (blogs) =>
        _.sumBy(blogs, 'likes')
    );

    const mostLikesAuthor = _.maxBy(
        Object.entries(authorLikes),
        ([author, likes]) => likes
    );

    return {
        author: mostLikesAuthor[0],
        likes: mostLikesAuthor[1]
    };
};
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
