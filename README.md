# webpack-spa

#### 介绍
使用 webpack 构建单页应用

#### Webpack 使用

1. JS 的 tree-shaking

webpack 的 tree-shaking 只能识别到简单的 import，对于 scope 里的东西识别不到，也就无法 tree-shaking 掉。不过我们可以借助[webpack-deep-scope-analysis-plugin](https://github.com/vincentdchan/webpack-deep-scope-analysis-plugin) 这个插件来 tree-shaking 掉 scope 里的东西，实现深度 tree-shaking。

2. lodash 和 lodash-es 的区别是，lodash-es 支持解构导入需要的函数，但是 lodash 不行。

```js
import { isArray } from 'lodash-es';
```

3. CSS module

```js
{
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[name]_[local]-[hash:base64:8]'  // 自定义类名，样式文件名_类名-hash值
    }
  }
}
```

4. CSS 的 tree-shaking

使用 [purifycss-webpack](https://github.com/webpack-contrib/purifycss-webpack) 插件，配合 [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) 插件一起使用。

注意，mini-css-extract-plugin 不能跟 style-loader一起使用。purifycss-webpack 不能跟 css module 一起使用，所以它比较适合多页应用，因为多页应用一般不会使用 css module；并且它是通过正则去匹配的，所以即使在 html 中注释掉代码还是能找到，必须得删掉。

5. set-iterm2-badge

有的时候我们一次性开了多个终端窗口，会容易分不清当前窗口是什么环境或者是做什么用的，这个时候，就可以借助 [set-iterm2-badge](https://www.npmjs.com/package/set-iterm2-badge) 这个插件来帮助我们标记当前窗口具体是做什么的。用法也很简单：

```js
const setIterm2Badge = require( 'set-iterm2-badge');
setIterm2Badge('开发环境');
```

6. 根据不同环境动态拉取配置文件进行合并

- 首先，拿到当前环境值。

```js
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
```

- 然后，根据拿到的环境值加载不同的配置文件。

```js
const _mergeConfig = require(`./config/webpack.${_mode}.config.js`);
```

- 最后，安装使用 [webpack-merge](https://www.npmjs.com/package/webpack-merge) 插件合并所有配置。

```js
const { merge } = require('webpack-merge');
webpackConfig = {
  // ...
};
module.exports = merge(_mergeConfig, webpackConfig);
```

7. 每次重新构建前清除构建目录文件

使用 [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin) 插件。

8. 自动生成 html 文件

使用 [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) 自动生成页面。

9. 热更新

安装使用 webpack-dev-server 插件。

```json
"scripts": {
  "dev:server": "webpack-dev-server --mode development"
}
```

这样就可以实现热更新功能了。

除此之外，我们也可以自己配置 dev-server 的其他功能，比如指定端口号、mock 数据等等。

```js
devServer: {
  port: 3000,
  hot: true,
  before(app) {
    app.get('/api/test', (req, res) => {
      res.json({
        code: 200,
        data: 'hello api'
      });
    })
  }
}
```

10. 魔法注释（Magic Comments）

```js
import(/* webpackChunkName: 'async-test' */ './components/async/index.js').then(_ => {  // 魔法注释（Magic comments），导入异步包
  _.default.init();
});
```

重新打包后会生成 async-test.bundle.js 文件。

11. 抽取公共文件和 webpack 运行时文件

```js
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
```

12. 单页应用最重要的四个文件

- webpack 运行时文件：runtime.bundle.js

- 公共文件：common.bundle.js

- 启动页文件：main.bundle.js

- 日常业务文件：async-test.bundle.js

#### Webpack 优化

**开发阶段**

1. 开启多核压缩

使用 [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 插件。

2. 监控打包速度

使用 [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin) 插件。

3. 开启通知面板

使用 [webpack-build-notifier](https://www.npmjs.com/package/webpack-build-notifier) 插件。

构建结束后会弹出提示框，提示框的样式根据系统的不同有所不同。

4. 开启打包进度

使用 [progress-bar-webpack-plugin](https://www.npmjs.com/package/progress-bar-webpack-plugin) 插件。

使用之后构建过程中会显示构建进度条。

5. 开启打包结果面板

使用 [webpack-dashboard](https://www.npmjs.com/package/webpack-dashboard) 插件。

6. 修改终端标题

使用 [node-bash-title](https://www.npmjs.com/package/node-bash-title) 插件。

**上线阶段**

1. es6 不需要编译

```html
<script type="module" src="./main.js"></script>
<script nomodule src="./main.es5.js"></script>
```

准备两个版本的 js，一个 es6，一个兼容版本。

像 set、map 这些可以使用动态 polyfill 服务。千万不要使用 babel-polyfill，这个包太大了。

https://polyfill.io/v3/api/

2. 前端缓存小负载

使用 [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin) 插件。会在 dist 目录下生成 manifest.json 文件，这个文件对性能优化非常重要，可以用来更新离线缓存。

```json
{
  "async-test.js": "/scripts/async-test.a352a.bundle.js",
  "common.css": "/styles/1.a352a.css",
  "common.js": "/scripts/common.a352a.bundle.js",
  "main.js": "/scripts/main.a352a.bundle.js",
  "runtime.js": "/scripts/runtime.a352a.bundle.js",
  "index.html": "/index.html"
}
```

3. 单页应用首屏加载效果实现

使用 html-webpack-plugin 插件动态注入。

```js
const loading = {
  html: '加载中...'
}

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      loading
    })
  ]
}
```

```html
<div id="app">
  <%= htmlWebpackPlugin.options.loading.html %>
</div>
```

如果要做真实的 loading，就需要自己写插件，计算出首页有多少资源。然后根据计算出来的资源结合上面的方法来实现。

4. 打包体积分析

- [webpack-chart](https://github.com/alexkuz/webpack-chart)

- [analyse](https://webpack.github.io/analyse/)

5. webpack 中有三个配置属性非常重要。

- test、exclude、include

#### 软件架构
软件架构说明

#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
