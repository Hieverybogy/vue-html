const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const config = require('../config');
const baseConfig = require('./webpack.base.conf');

// config
const devConfig = merge(baseConfig, {
    devtool: config.dev.devtool,
    devServer: {
        historyApiFallback: false,
        hot: true,
        contentBase: false,
        compress: config.dev.compress || false,
        host: config.dev.host,
        port: config.dev.port,
        publicPath: config.dev.assetsPublicPath,
        quiet: true,
        watchOptions: {
            poll: config.dev.poll,
            ignored: /node_modules/,
            aggregateTimeout: config.dev.timeout
        },
        stats: 'errors-only'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // 提取业务公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libs',
            minChunks: 2
        }),
        // 提取依赖模块
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

module.exports = devConfig;
