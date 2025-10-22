const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const publicDir = path.resolve(__dirname, 'public');
const isProduction = process.env.NODE_ENV === 'production';

let env = dotenv.config().parsed || {};
let specifiedEnvPath;
if (isProduction) {
  specifiedEnvPath = path.resolve(process.cwd(), '.env.production');
} else {
  specifiedEnvPath = path.resolve(process.cwd(), '.env.development');
}
if (fs.existsSync(specifiedEnvPath)) {
  env = {
    ...env,
    ...dotenv.config({
      path: specifiedEnvPath,
    }).parsed,
  };
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ['./src/index.tsx'],
  output: {
    path: publicDir,
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
  performance: isProduction
    ? undefined
    : {
        hints: false,
      },
  devServer: {
    static: {
      directory: publicDir,
    },
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
  ],
};
