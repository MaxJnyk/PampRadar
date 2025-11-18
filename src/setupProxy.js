const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://launch.meme',
      changeOrigin: true,
      secure: false,
      ws: true,
      pathRewrite: {
        '^/api': '/api', // Оставляем /api в пути
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> https://launch.meme${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy Response] ${req.url} -> ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Error]', err.message);
      },
    })
  );
};
