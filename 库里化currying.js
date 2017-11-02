function createCurry (func) {
  if (typeof(func) !== 'function') {
    // 没函数你库里个毛？
    // throw new Error('you must have a function')
    return;
  }
  var arity = func.length;
  if (arity === 0) {
    // 没有形参，说明函数不需要参数，也就不用库里化。也有可能是无限参数，那就是另外一个故事了
    return;
  }
  function recursion (_context, func, _args) {
    return function () {
      _args.push.apply(_args, arguments)
      if (_args.length < arity) {
        return recursion(_context, func, _args)
      }
      return func.apply(_context, _args)
    }
  }
  return function () {
    var _context = this;
    var _args = [].slice.call(arguments);
    if (_args.length < arity) {
      return recursion(_context, func, _args);
    }
    return func.apply(_context, _args);
  }
}

// 这个另外的故事
// 无限参数一般都会有一个统一的计算方式，用一个reduce方式就可以抽象出来
function createCurryInfinity (reduceFunc, firstArg) {
  if (typeof(reduceFunc) !== 'function') {
    // 没函数你库里个毛？
    // throw new Error('you must have a function')
    return;
  }
  // 默认的reduce函数，累加
  reduceFunc = reduceFunc || function (a, b) {
    return a + b;
  }
  return function () {
    var _context = this;
    var _args = [];
    var reducer = function () {
      [].push.apply(_args, arguments);
      return reducer;
    }
    reducer.valueOf = function () {
      return firstArg ? _args.reduce(reduceFunc.bind(_context), firstArg) : _args.reduce(reduceFunc.bind(_context));
    }
    return reducer.apply(_context, arguments);
  }
}

// PS
// 这个无限参数最终获取的值打印出来前面会带一个小f
// 比如
var add = createCurryInfinity(function (a, b) {
  return a + b;
})
add(1, 2)(3, 5) // f 11
// 但是如果返回值用来计算的话，就是正常的
// 比如
1 + add(1, 2)(3, 5) // 12

// 关于隐式类型转换 toString和valueOf
// 1. 对象（包括Function, Date, Array等）在进行隐式类型转换(比如参与运算)的时候，会调用这俩方法
// 2. 这俩都有默认的实现
// 3. 重写这俩方法都会提高他们的优先级，重写哪个实际上就调用的是哪个
// 4. 但是如果俩都重写，那就好玩了。一般情况都是先调用valueOf
// 5. 如果valueOf返回一个非原始类型数据，再调用toString，如果toString也返回非原始类型，那就只好报错了
// 6. 个人已知有两种方式会优先调用toString，一个是直接new String(obj)，另一个是`${obj}`
