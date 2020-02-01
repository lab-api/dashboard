const webpack = require('webpack');
const config = {
    entry:  __dirname + '/js/widgets.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        library: 'widgets',
        libraryTarget: 'var'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
    }
};
module.exports = config;
