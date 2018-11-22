var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'library'),
        filename: 'react-composite-table.js',
        library: 'react-composite-table',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|library)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname+"/node_modules/react-datepicker/stylesheets/", "scss")
                ],
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ]
};
