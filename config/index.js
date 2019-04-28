'use strict';

const path = require('path');

module.exports = {
    dev: {
        // 路径
        assetsDirectory: 'static',
        assetsPublicPath: '/',
        // 服务器配置
        host: 'localhost',
        // host: '0.0.0.0',
        port: 8080,
        poll: 1000,
        timeout: 300,
        compress: true,
        // Source Maps
        devtool: 'cheap-module-eval-source-map',
        // devtool: false,
        cssSourceMap: false,
        // 是否打破缓存
        cacheBusting: false
    },
    prod: {
        // 路径
        root: path.resolve(__dirname, '../../s/app/view'),
        assetsRoot:  path.resolve(__dirname, '../../s/app/public'),
        assetsDirectory: 'static',
        assetsPublicPath: '/',
        // Source Maps
        productionSourceMap: false,
        devtool: '#source-map',
        // 是否每次都清空文件
        clean: false
    }
};