if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // internal isCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    var args = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP ? this : oThis, args.concat(Array.prototype.slice.call(arguments)));
        }

    // 维护原型关系
    if (this.prototype) {
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();
    return fBound;
  }
}
