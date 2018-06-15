// 计数器
class Count {
  
  constructor(options) {
    this.error = 0;     // 失败次数
    this.wrong = 0;     // 错误返回值次数
    this.success = 0;   // 成功次数
    this.index = 0;     // 当前请求序号
    this.states = [];   // 请求的状态
    this.timeTotal = 0; // 请求的总时间
    this.minTime = 0;   // 最快时间
    this.maxTime = 0;   // 最慢时间
    this.count = options.count; // 请求的总次数
    this.rest = options.count; // 剩余请求的总次数
    this.errors = [];   // 收集的错误
    this.errorCount = options.errorCount || 1;  // 收集错误的个数，默认是1个
    this.wrongs = [];   // 收集的tester失败的
    this.wrongCount = options.errorCount || 1;  // 收集失败的个数，默认是1个
    this.startTime = new Date();  // 开始请求时间
  }

  // 只获取有用的数据
  getData () {
    return {
      error: this.error,
      wrong: this.wrong,
      success: this.success,
      count: this.count,
      timeTotal: this.timeTotal,
      avgTime: this.timeTotal / this.count,
      minTime: this.minTime,
      maxTime: this.maxTime,
      // 测试人等待时间
      testTime: this.endTime - this.startTime,

      errors: this.errors,
      wrongs: this.wrongs
    };
  }

  // 结束请求
  end () {
    this.endTime = new Date();  // 结束请求时间
    return this.getData();
  }
}

module.exports = Count;