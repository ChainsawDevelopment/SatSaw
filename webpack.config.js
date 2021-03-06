const path = require('path');

module.exports = {
    entry: ['./src/index.tsx'],
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
          },
          { test: /\.(jpe?g|gif|png|svg|eot|ttf|woff|woff2)$/, loader: 'file-loader', options: { name: '[hash].[ext]' } },
        ]
      },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true
    }
  };