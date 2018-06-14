const Request = require('./lib/request');

// 默认参数
const default_options = {
  concurrency: 1, // 并发数
  count: 10 // 总数
};

module.exports = function(request_options, options = {}, cb){
  // 配置options
  options = Object.assign({}, default_options, options);
  options.request = request_options;
  return new Request(options, cb);
};