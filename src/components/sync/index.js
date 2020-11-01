import lodash from 'lodash-es';
import item from './sync.css';
import help from '../common/help.js';

console.log(help.version);
const sync = function() {
  console.log('sync');
  // document.getElementById('app').innerHTML = `<h1 class="${item.test}">hello webpack</h1>`; // css module
  fetch('/api/test')
    .then(res => res.json())
    .then(data => {
      console.log(data.data);
    })
  setTimeout(function() {
    document.getElementById('app').innerHTML = `<h1>hello webpack</h1>`
  }, 1000);
}
const isArray = function(args) {  // 此处 isArray 虽然没有用到，但是 webpack 的 tree-shaking 并不能把它去掉，因为 lodash 是 scope 里的，webpack 识别不到，只能识别到普通的 import
  console.log(lodash.isArray(args));
}
export {
  sync,
  isArray
}