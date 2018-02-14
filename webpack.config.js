var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: './lib/index.js',
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
                include: path.resolve(__dirname, 'lib'),
                exclude: /(node_modules|library)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    externals: {
        'react': 'commonjs react'
    },
    devServer: {
        inline: true,
        port: 9001
    },
};