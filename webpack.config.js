const webpack = require('webpack');
const dotenv = require('dotenv');

const publidDir = __dirname + '/public';
const env = dotenv.config().parsed;

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    path: publidDir,
    publicPath: '/',
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
  ],
};
