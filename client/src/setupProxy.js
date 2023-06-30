const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
  app.use(createProxyMiddleware("/api/**", {
    target: "https://personal-library-backend.vercel.app",
    changeOrigin: true
  }));
};