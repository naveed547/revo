const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './assests/js/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },
  module: {
    rules: [
    {
      enforce: 'pre',
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'tslint-loader',
      options:{
        emitErrors: true,
        failOnHint: true,
        typeCheck: true
      }
    },
    {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
    },
    {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        exclude: /icons/,
        use: ['file-loader'],
    },
    {
        test: /\.svg(\?\S*)?$/,
        use: ['file-loader'],
    },
    {
        test: /\.(gif|jpg|png|ico)(\?\S*)?$/,
        use: ['url-loader'],
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'sass-loader'
        ]
      })
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {root: __dirname}),
    new ExtractTextPlugin('/[name].css'),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: 'bundle.html',
    }),
    new CopyWebpackPlugin([{ from: __dirname+'/assests/images/', to: __dirname+'/build/images/',flatten: true}]),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".scss"]
  }
}