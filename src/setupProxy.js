const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

module.exports = function(app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://projectx.indonesia-datacenter.com',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }));

    app.use(morgan('combined'));
}