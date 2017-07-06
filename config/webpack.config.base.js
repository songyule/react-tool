'use strict';

const path = require('path');
const webpack = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

module.exports = {
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, '../src'),
      'public': path.resolve(__dirname, '../public'),
      'api': path.resolve(__dirname, '../src/api'),
      'lib': path.resolve(__dirname, '../src/lib'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'actions': path.resolve(__dirname, '../src/redux/actions'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'router': path.resolve(__dirname, '../src/router'),
      'mock': path.resolve(__dirname, '../src/mock'),
      'constants': path.resolve(__dirname, '../src/redux/constants'),
      'components': path.resolve(__dirname, '../src/components'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'reducers': path.resolve(__dirname, '../src/redux/reducers')
    },
    plugins: [
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new webpack.DefinePlugin(env.stringified),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
