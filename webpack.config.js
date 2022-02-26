const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: 'svg-inline-loader',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js)$/,
                use: "babel-loader",
            },
            {
                test: /\.(jpeg|png|jpg|svg|gif)$/i,
                loader: "file-loader",
                options: {
                    name: '[name].[hash:6].[ext]',
                    outputPath: 'img',
                    publicPath: 'img',
                    emitFile: true,
                    esModule: false
                }
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'src/indexref.html'
    }),
],
    mode: process.env.NODE_ENV === "production" ? "production" : "development"
};