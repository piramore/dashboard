const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { APP_API } = require('./configs/AppConfig');

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