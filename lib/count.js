const fs = require('fs');

// 计数器
class Count {
  
  constructor (options) {
    this.error = 0;       // 失败次数
    this.wrong = 0;       // 错误返回值次数
    this.success = 0;     // 成功次数
    this.index = 0;       // 当前请求序号
    this.timeTotal = 0;   // 请求的总时间
    this.avgTime = 0;     // 平均请求时间
    this.minTime = 0;     // 最快时间
    this.maxTime = 0;     // 最慢时间
    this.startTime = new Date();    // 开始请求时间
    this.endTime = null;            // 结束请求时间
    this.testTime = null;           // 本次测试花费的时间
    this.options = options;         // 保存请求对象
    this.states = [];               // 请求的状态
    this.count = options.count;     // 请求的总次数
    this.rest = options.count;      // 剩余请求的总次数
    this.errors = [];     // 收集错误的信息
    this.wrongs = [];     // 收集的tester失败的信息
    this.successes = [];  // 收集成功的信息
    this.collectCount = options.collectCount || 1;  // 收集错误或失败的个数，默认是1个
  }

  // 结束请求
  end () {
    this.endTime = new Date();  // 设置结束请求时间
    this.avgTime = this.timeTotal / this.count;  // 设置平均请求时间
    this.testTime = this.endTime - this.startTime;  // 设置本次测试花费的时间
    return this;
  }

  // 只获取有用的数据
  toJson () {
    return {
      error: this.error,
      wrong: this.wrong,
      success: this.success,
      count: this.count,
      timeTotal: this.timeTotal,
      avgTime: this.avgTime,
      minTime: this.minTime,
      maxTime: this.maxTime,
      testTime: this.testTime,
      successes: this.successes,
      errors: this.errors,
      wrongs: this.wrongs
    };
  }

  // 导出
  export (path) {
    let data = JSON.stringify(this.toJson(), null, 2);
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, function(err){
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Count;