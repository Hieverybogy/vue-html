const App = require('../config/app');
const path = require('path');
const config = require('../config/index.js');
const isProd = process.env.NODE_ENV === 'production';

function merge(a, b) {
    return {
        css: (a.css || []).concat(b.css || []),
        js: (a.js || []).concat(b.js || [])
    };
}

function entries() {
    const result = {};
    App.pages.forEach(p => {
        result[p.entry] = path.resolve(App.basePath, p.entry);
    });
    return result;
}

function templates() {
    const chunks = ['vendor', 'manifest', 'libs'];
    const tempConfig = isProd ? {
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
    } : {};
    return App.pages.map(p => {
        return Object.assign({
            title: p.title,
            cache: true,
            filename: `${p.entry}.html`,  //path.resolve(__dirname,`../../s/views/${p.entry}.html`)
            template: path.resolve(__dirname, 'index.tpl'),
            inject: true,
            cdn: merge(App.cdn, p.cdn),
            chunks: [...chunks, p.entry]
        }, tempConfig);
    });
}

function getPageConfig() {
    return {
        entries: entries(),
        templates: templates()
    };
}

module.exports = getPageConfig();