const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: ["babel-polyfill", "./demo/src/index.js"],
    mode: 'production',
    performance: {
        maxEntrypointSize: 3000000,
        maxAssetSize: 3000000,
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: './',
        path: path.resolve(__dirname, 'demo', 'pages')
    },
    watchOptions: {
        poll: 1000
    },
    module: {
        rules: [
            {
                test: /demo\/\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Table demo',
            template: './webpack_template/index.ejs',
            inject: '#root',
        }),
    ]
});