# bench-slim

很简单的测试工具，当然，返回的数据也很简单

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
    return true;
  },
  // 请求前会调用
  // 你可以修改请求的options，来设置这次请求的headers、cookie等等
  beforeHook: function(options, index){
    console.log(index)
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

bench(request_options, options, function(result){
  console.log(result)
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