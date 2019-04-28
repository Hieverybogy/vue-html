'use strict';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const shelljs = require('shelljs');

const baseConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');
const env = require('../config/prod.env');

const prodConfig = merge(baseConfig, {
    devtool: config.prod.productionSourceMap ? config.prod.devtool : false,
    output: {
        filename: utils.assetsPath('js/[name].js?v=[chunkhash:7]'),
        chunkFilename: utils.assetsPath('js/[id].js?v=[chunkhash:7]')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                ecma: 8,
                output: {
                    comments: false,
                    beautify: false
                },
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.prod.productionSourceMap,
            cache: true,
            parallel: 4
        }),
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].css?v=[chunkhash:7]'),
            allChunks: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.prod.productionSourceMap ? {
                safe: true,
                map: {
                    inline: false
                }
            } : {
                safe: true
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        //提取业务公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libs',
            minChunks: 2
        }),
        //提取依赖模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(path.join(process.cwd(), 'node_modules')) === 0
                );
            }
        }),
        // 提取webpack运行时
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })
    ]
});



config.prod.clean && shelljs.rm('-rf', config.prod.root);

module.exports = prodConfig;