const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js'
  },
  // converts final ES6 > ES5
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css', '.svg'],
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Hooks: path.resolve(__dirname, 'src/hooks/'),
      Assets: path.resolve(__dirname, 'src/assets/')
    }
  },
  module: {
    rules: [
      // TypeScript > ES6 JS
      {
        rules: [
          {
            test: /\.(ts|js)x?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      },

      // SCSS > CSS
      {
        test: /\.(scss|css)$/,
        use: [
          // creates 'style' nodes from JS strings
          'style-loader',
          // translates CSS into CommonJS
          'css-loader',
          // composes Sass to CSS
          'sass-loader'
        ]
      },

      // SVG > React component
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },

  plugins: [new ForkTsCheckerWebpackPlugin()]
};
