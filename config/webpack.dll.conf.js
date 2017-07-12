    // 'antd',
    // 'react-lz-editor',
const vendor = [
    'array-to-tree',
    'babel-plugin-import',
    'classnames',
    'draftjs-to-html',
    'enquire.js',
    'es6-promise',
    'html-to-draftjs',
    'isomorphic-fetch',
    'lazyimage',
    'nprogress',
    'prop-types',
    'query-string',
    'rc-queue-anim',
    'rc-tween-one',
    'react',
    'react-dnd',
    'react-dnd-html5-backend',
    'react-dom',
    'react-draft-wysiwyg',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-router-redux',
    'redux',
    'redux-logger',
    'redux-thunk',
    'standard-error'
]

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: vendor
  },
  output: {
    path: path.join(__dirname, '../public/js'),
    filename: '[name].dll.js',
    library: '[name]_library'       // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
