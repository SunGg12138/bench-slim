exports.deepClone = function deepClone(obj){
  // 先确定obj是不是数组
  let result = Array.isArray(obj)? [] : {};

  // 递归
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = deepClone(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}