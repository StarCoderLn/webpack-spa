import { sync } from './components/sync'; // 导入同步包
import(/* webpackChunkName: 'async-test' */ './components/async/index.js').then(_ => {  // 魔法注释（Magic comments），导入异步包
  _.default.init();
});

console.log('hello webpack');
sync();