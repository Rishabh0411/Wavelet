const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'static/frontend'),
            filename: 'main.js',  // explicit
            publicPath: '/static/frontend/',  // helps with asset resolution if needed
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
        optimization: {
            minimize: isProduction,
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
            }),
        ],
        mode: isProduction ? 'production' : 'development',
    };
};
