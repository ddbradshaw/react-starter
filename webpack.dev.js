const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // Enable sourcemaps for debugging webpack's output.
  devtool: "none",

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude:[/node_modules/, /__tests__/]},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.(s*)css$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  devServer: {
    host: 'localhost',
    port: 8080,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true,
    // enable HMR on the server
  }
});