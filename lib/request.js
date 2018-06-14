const Count = require('./count');
const rp = require('request-promise');

class Request {
  constructor(options, cb) {
    this.cb = cb;
    this.count = new Count(options);
    this.options = options;
    this.run();

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /*
  * 开始运行请求
  */
  run () {
    // 并发请求
    for (let i = 0, times = this.options.concurrency; i < times; i++) {
      this.count.states[i] = false;
      this.req(i);
    }
  }

  /*
  * 并发的单个请求
  */
  async req (tag) {
    // 这次请求完成了，执行完了
    // 判断是不是完成了请求数
    if (this.count.index === this.count.rest) {
      if (this.count.states.every(item => item === true)) {
        // 调用计数器的end方法，返回简单的数据
        let result = this.count.end();

        // 调用回调函数和Promise
        this.cb && this.cb(result);
        this.resolve(result);
      }
      return;
    }

    // 本次请求开始，标记为false
    this.count.states[tag] = false;

    // 计数器的序号++
    this.count.index++;

    let body, error;  // 每次请求的响应数据

    // 请求前的hook，方便用户修改请求参数
    this.options.beforeHook && this.options.beforeHook(this.options, this.count.index);

    try {
      // 开始时间
      let start = new Date();

      // 异步请求
      body = await rp(this.options.request);

      // 等待时间
      let wait = new Date() - start;
      
      // 耗时计算
      this.count.timeTotal += wait;
      if (wait < this.count.minTime || this.count.minTime === 0) this.count.minTime = wait;
      if (wait > this.count.maxTime || this.count.maxTime === 0) this.count.maxTime = wait;

      // 返回数据测试计算
      if (!this.options.tester || this.options.tester(body)) {
        this.count.success++;
      } else {
        this.count.wrong++;
      }
    } catch (err) {
      error = err;
      this.count.error++;

      // 把错误放到错误盒里
      if (this.count.errors.length < this.count.errorCount) {
        this.count.errors.push(err);
      }
    }

    // 请求后的hook，方便用户查看内容
    this.options.afterHook && this.options.afterHook(error, body);

    // 本次请求结束，标记为true
    this.count.states[tag] = true;

    // 继续请求
    this.req(tag);
  }
};

module.exports = Request;