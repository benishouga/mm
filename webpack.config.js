const publidDir = __dirname + '/public';

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
};
