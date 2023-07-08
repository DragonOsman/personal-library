const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();

app.use([
  "/users/user-info", "/users/register", "/users/login", "/users/logout", "/api/books/*"
], createProxyMiddleware({
  target: "https://personal-library-server.onrender.com",
  changeOrigin: true
}));
