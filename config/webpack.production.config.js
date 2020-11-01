// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  output: {
    filename: 'scripts/[name].[hash:5].bundle.js',
    publicPath: '/'
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({  // 开启多核压缩
  //       // parallel: true,
  //       parallel: os.cpus().length
  //     })
  //   ]
  // }
  plugins: [
    new ParallelUglifyPlugin({
      exclude: /\.min.js$/,
      workerCount: os.cpus().length,
      // uglifyJS: {
      // },
      uglifyES: {
        output: {
          beautify: false,
          comments: false
        },
        compress: {
          warnings: false,
          drop_console: true,
          collapse_vars: true
        }
      }
    }),
  ],
}