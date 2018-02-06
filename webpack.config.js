var path = require('path');
module.exports = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'react-composite-table.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'lib'),
                exclude: /(node_modules|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    },
    devServer: {
        inline: true,
        port: 9001
    },
};