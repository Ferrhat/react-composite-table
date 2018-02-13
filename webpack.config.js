var path = require('path');

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
    externals: {
        'react': 'commonjs react'
    },
    devServer: {
        inline: true,
        port: 9001
    },
};