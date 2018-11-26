const path = require('path');

module.exports = {
    entry: ['./src/index.tsx'],
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'dist.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader'
          }
        ]
      },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
  };