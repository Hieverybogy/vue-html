'use strict';
const utils = require('./utils');
const config = require('../config');
const isProd = process.env.NODE_ENV === 'production';
const sourceMapEnabled = isProd ? config.prod.productionSourceMap : config.dev.cssSourceMap;

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: sourceMapEnabled,
        extract: isProd
    }),
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
};