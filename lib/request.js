const Count = require('./count');
const deepClone = require('./utils').deepClone;
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

        // 在下一轮询，调用回调函数和Promise
        process.nextTick(() => {
          this.cb && this.cb(result);
          this.resolve(result);
        });
      }
      return;
    }

    // 本次请求开始，标记为false
    this.count.states[tag] = false;

    // 计数器的序号++
    this.count.index++;

    // 每次请求的响应数据，错误，请求后计算的结果
    let body, error;

    try {
      // 请求的参数有可能需要更改，先要clone一份
      let request_options = deepClone(this.options.request);
      // 请求前的hook，方便用户修改请求参数
      this.options.beforeHook && this.options.beforeHook(request_options, this.count.index);
      // 请求前的hook，方便用户修改请求参数，这个是异步的
      this.options.asyncBeforeHook && await this.options.asyncBeforeHook(request_options, this.count.index);

      // 开始时间
      let start = new Date();

      // 异步发送http请求
      body = await rp(request_options);

      // 返回数据测试计算
      if (!this.options.tester || this.options.tester(body)) {
        // 等待时间计算
        let wait = new Date() - start;
        // 耗时计算，只有请求成功时才会计算
        this.count.timeTotal += wait;
        if (wait < this.count.minTime || this.count.minTime === 0) this.count.minTime = wait;
        if (wait > this.count.maxTime || this.count.maxTime === 0) this.count.maxTime = wait;
        this.res('success', body);
      } else {
        this.res('wrong', body);
      }
    } catch (err) {
      error = err;
      this.res('error', error);
    }

    // 请求后的hook，方便用户查看内容
    this.options.afterHook && this.options.afterHook(error, body);

    // 本次请求结束，标记为true
    this.count.states[tag] = true;

    // 继续请求
    this.req(tag);
  }

  // 响应结果给计数器
  res (status, data) {
    let collectCount = this.count.collectCount;
    switch (status) {
      case 'success':
        this.count.success++;
        // 把结果放到指定盒子里
        if (this.count.successes.length < collectCount) {
          this.count.successes.push(data);
        }
      break;
      case 'wrong':
        this.count.wrong++;
        // 把结果放到指定盒子里
        if (this.count.wrongs.length < collectCount) {
          this.count.wrongs.push(data);
        }
      break;
      case 'error':
        this.count.error++;
        // 把结果放到指定盒子里
        if (this.count.errors.length < collectCount) {
          this.count.errors.push(data);
        }
      break;
    }
  }
};

module.exports = Request;