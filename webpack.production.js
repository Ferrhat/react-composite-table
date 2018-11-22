const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        filename: '[name].bundle.js',
        publicPath: './',
        path: path.resolve(__dirname, 'library')
    },
    mode: 'production',
    performance: {
        maxEntrypointSize: 3000000,
        maxAssetSize: 3000000,
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 1
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['library']),
        new CompressionPlugin()
    ]
});