const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

const config = require('../config/index.js');
const pageConfig = require('./page.conf.js');
const utils = require('./utils.js');
const vueLoaderConfig = require('./vue-loader.js');

// vars
const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// config
const baseConfig = {
    entry: pageConfig.entries,
    output: {
        path: config.prod.root,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('js/[id].js'),
        publicPath: isProd ? config.prod.assetsPublicPath : config.dev.assetsPublicPath
    },
    devServer: {
        disableHostCheck: true,
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        }
    },
    module: {
        rules: [{
            test: /\.(less|css)$/,
            loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            include: [resolve('src')],
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[ext]?v=[hash:7]')
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('media/[name].[ext]?v=[hash:7]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[ext]?v=[hash:7]')
            }
        }]
    },
    plugins: [
        ...pageConfig.templates.map(template => new HtmlWebpackPlugin(template)),
        new ProgressBarPlugin({
            format: ` build [:bar]${chalk.green.bold(':percent')} (:elapsed seconds)`,
            clear: false
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsDirectory,
                ignore: ['.*']
            }
        ])
    ]
};

module.exports = baseConfig;