const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const publidDir = __dirname + '/public';

let env = dotenv.config().parsed;
let specifiedEnvPath;
if (process.env.NODE_ENV === 'production') {
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
