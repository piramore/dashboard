const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const APP_API = process.env.REACT_APP_CORE_API;

module.exports = function(app) {
    app.use(createProxyMiddleware('/api', {
        target: APP_API,
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }));

    app.use(morgan('combined'));
}