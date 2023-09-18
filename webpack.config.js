const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: './src/build.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/public',

    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', "sass-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:['file-loader']
            }
        ]
    }
}