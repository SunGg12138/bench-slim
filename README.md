# bench-slim

很简单的并发测试工具，当然，返回的数据也很简单

## 安装

```bash
$ npm install bench-slim --save-dev
```

## examples

```javascript

const bench = require('bench-slim');

let options = {
  concurrency: 50, // 并发数

  count: 100, // 总请求数

  // 把结果传过来测试
  // 如果返回false，会把这次请求算作wrong属性上
  tester: function(body){
    return /百度首页/.test(body);
  },
  // 请求前会调用
  // 你可以修改请求的options，来设置这次请求的headers、cookie等等
  beforeHook: function(options, index){
    console.log(index)
  },
  // 异步的钩子，可以进行异步设置参数
  asyncBeforeHook: function (options, index){
    return Promise.resolve();
  },
  // 请求后会调用
  // 你可以在这里查看这次请求返回的错误和返回的数据
  afterHook: function(err, body){
    console.log(body)
  }
};

// request_options的参数与request模块的参数一样
let request_options = {
  url: 'https://www.baidu.com/',
  method: 'GET'
};

bench(request_options, options, async function(result){
  // 把结果数据打印出来
  console.log(result.toJson());
  // 把结果数据输出到指定文件
  await result.export(__dirname + '/result.json');
});

// 结果
// { error: 0,         // 错误的次数
//   wrong: 0,         // tester函数返回false的次数
//   success: 100,     // 成功的次数
//   count: 100,       // 总数
//   timeTotal: 29530, // 请求花费的总时间
//   avgTime: 295.3,   // 请求花费的平均时间
//   minTime: 44,      // 请求花费的最短时间
//   maxTime: 1123,    // 请求花费的最长时间
//   errors: [],       // 收集发生的错误
//   testTime: 1376 }  // 你等待的时间
```