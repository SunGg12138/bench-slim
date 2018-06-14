const bench = require('../index');

let options = {
  concurrency: 50, // 并发数

  count: 100, // 总数

  // // 把结果传过来测试
  // tester: function(body){
  //   return body.code === 200;
  // },
  // // 请求前会调用
  // beforeHook: function(options, index){
  //   console.log(index)
  // },
  // // 请求后会调用
  // afterHook: function(err, body){
  //   console.log(err, body)
  // }
};
let request_options = {
  url: 'http://127.0.0.1:52101/api/getSimpleData',
  // headers: {},
  // cookie: {},
  body: { ids: '123456' },
  // form: {},
  method: 'POST',
  json: true
};

bench(request_options, options, function(result){
  console.log(result)
});