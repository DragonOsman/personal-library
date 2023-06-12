const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    ["/api/users/login", "/api/users/register", "/api/books/add-book", "/api/books/list-books",
    "/api/books/show-book/:id", "api/books/update-book/:id", "/api/books/delete-book/:id",
    "/api/users/is-user-auth"],
    createProxyMiddleware({
      target: "http://localhost:5000/"
    })
  );
};