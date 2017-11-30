const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'vast2json.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'vast2json.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
