const path = require('path');
const glob = require('glob');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const PurifyCSSPlugin = require('purifycss-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const setIterm2Badge = require( 'set-iterm2-badge');
setIterm2Badge('开发环境');
const { merge } = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _modeFlag = (_mode === 'production');
const _mergeConfig = require(`./config/webpack.${_mode}.config.js`);
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const DashboardPlugin = require("webpack-dashboard/plugin");
const setTitle = require('node-bash-title');
setTitle('my title');
const ManifestPlugin = require('webpack-manifest-plugin');
const loading = {
  html: '加载中...'
}

webpackConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          // options: {
          //   modules: {
          //     localIdentName: '[name]_[local]-[hash:base64:8]'  // 自定义类名，样式文件名_类名-hash值
          //   }
          // }
        }]
      }
    ]
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "Webpack 构建 SPA",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),
    new WebpackDeepScopeAnalysisPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, './src/*.html')),
    }),
    new MiniCssExtractPlugin({
      filename: _modeFlag ? 'styles/[name].[hash:5].css' : 'styles/[name].css',
      chunkFilename: _modeFlag ? 'styles/[id].[hash:5].css' : 'styles/[id].css',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      loading
    }),
    new ProgressBarPlugin(),
    new DashboardPlugin(),
    new ManifestPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'common',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  }
}

module.exports = smp.wrap(merge(_mergeConfig, webpackConfig));