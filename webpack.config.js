const path = require('path');

module.exports = {
  entry: './src/index.ts',
	devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(frag|vert)$/,
        type: "asset/source"
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/public/js/bundle/'),
  },
	mode: "development",
  optimization: {
    minimize: false,
  },
  experiments: {
    asset: true
  }
};