const path = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin');

const { join, resolve } = path

const root = resolve(__dirname)
const src = join(root, 'src')
const dest = join(root, '.')

module.exports = {
  devtool: 'source-map',
  entry: [join(src, 'index.js')],
  output: {
    publicPath: '/',
    path: dest,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: { commonjs: 'react', commonjs2: 'react' },
    'react-dom': { commonjs: 'react-dom', commonjs2: 'react-dom' },
    'material-ui': { commonjs: 'material-ui', commonjs2: 'material-ui' },
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production')
      }
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run docs']
    }),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [join(src)],
        exclude: ['node_modules'],
      },
      {
        test: /\.(css|less)/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: true,
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
  }
}
