const bench = require('../index');

let options = {
  concurrency: 50, // 并发数

  count: 100, // 总数

  // 把结果传过来测试
  tester: function(body){
    // console.log(body)
    return /百度首页/.test(body);
  },
  // 请求前会调用
  beforeHook: function(options, index){
    console.log("---------------", index)
  },
  // 请求后会调用
  afterHook: function(err, body){
    console.log(body)
  }
};
let request_options = {
  url: 'https://www.baidu.com/',
  // headers: {},
  // cookie: {},
  // body: { ids: '123456' },
  // form: {},
  method: 'GET',
  // json: true
};

bench(request_options, options, function(result){
  console.log(result)
});