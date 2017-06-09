### 箭头函数(arrow function)
#### 以下情况请避免使用箭头函数

1. 需要使用函数所属对象的this引用
2. DOM元素事件监听函数
3. 需要使用函数的arguments

如果这些情况下使用了箭头函数，1、2会导致this指向的是parent scope的this而不是函数所属的对象，3会报ReferenceError

### 模板字符串(template string)
#### 模板字符串可以层层内嵌使用：
```js
  const dogs = [
    { name: 'Snickers', age: 2 },
    { name: 'Hugo', age: 8 },
    { name: 'Sunny', age: 1 },
  ]

  const markup = `
    <ul class="dogs">
      ${dogs.map(dog => `<li>${dog.name} is ${dog.age * 7}</li>`).join('')}
    </ul>
  `
```
#### 标签模板
模板字符串有一个‘打标签’的功能，具体内容用代码解释如下：
```js
  /**
   * 标签函数，通常用来给模板字符串中的标量做自定义的修饰
   * @param  {[Array]} strings [根据模板字符串中的变量split出来的字符串数组, strings.length === values.length + 1]
   * @param  {[Array]} values  [字符串模板中的变量所组成的数组]
   */
  function highlight(strings, ...values) {
    // 在这个例子中
    // strings = ["My dog's name is ", " and he is ", " years old"]
    // values = ["Snickers", 100]
    console.log(strings);
    console.log(values);
    let str = '';
    strings.forEach((string, i) => {
      str += `${string}<span contenteditable class="hl">${values[i] || ''}</span>`
    });
    return str;
  }

  const name = 'Snickers';
  const age = 100;

  // 用法是方法名直接跟一个模板字符串
  const sentence = highlight`My dog's name is ${name} and he is ${age} years old`;
```

#### String新增方法
prototype中新增startsWith, endsWith, includes, repeat
Array上新增from, of, find, findIndex

#### for of
for..in 会遍历出prototype中的属性，所以尽量避免使用

#### Spread Operator
可以使用...来分割字符串
```js
const strs = [...'test']   //['t', 'e', 's', 't']
```

#### 关于babel
babel只是转义语法，对es6新增的对象或方法（比如Arrya.from, Promise, Map, Set等）并没有什么作用，所以我们需要polyfill的帮助。
[polyfill.io](https://cdn.polyfill.io/v2/docs/) 是一个智能的polyfill工具，它可以根据你的userAgent来自动生成对应的polyfill，chrome的devtool中 More tools -> Network conditions可以修改chrom的ua

#### generator
generator函数有两种写法：
```js
function* grt() {}
function *grt() {}
```
* 调用generator函数并不会执行函数中的语句而是先返回一个generator对象
* 调用generator对象的next方法会让generator函数中的语句开始执行，当遇到下一个yield语句或函数结束时停止
* next方法的返回值是一个对象`{ value: anything, done: boolean }`，此对象的value就是下一个yield后跟的值，而done是一个boolean值，代表generator函数是否已经执行完毕。
* 当generator函数执行过了最后一个yield后，再次调用next方法会返回`{ value: undefined/return value, done: true }`，如果generator函数有返回值，则value是return value，否则就是undefined(当然对于一个函数，如果没有明确返回值，那它就是返回undefined)，在这之后如果还是继续调用next，返回值就一定是`{ value: undefined, done: true }`
* next方法可以传参，其值就是yield语句的返回值

generator的一个主要用途就是处理需要按顺序执行的异步操作(比如ajax)：
```js
function ajax(url, dataGen) {
  fetch(url).then(response => response.json()).then(data => console.log(dataGen.next(data)))
}

function *steps(groupId) {
  console.log(groupId)
  const group = yield ajax(`https://api.boxfish.cn/group/${groupId}?access_token=ChlAuA5D1S`, dataGen)
  console.log(group)
  const userId = group[0].id
  const info = yield ajax(`https://api.boxfish.cn/wechat/more?userId=${userId}`, dataGen)
  console.log(info)
  return 'success'
}

const dataGen = steps(36301)
dataGen.next()
```
对于上面代码更好的封装是：
```js
function *steps(groupId) {
  console.log(groupId)
  const group = yield fetch(`https://api.boxfish.cn/group/${groupId}?access_token=ChlAuA5D1S`)
  console.log(group)
  const userId = group[0].id
  const info = yield fetch(`https://api.boxfish.cn/wechat/more?userId=${userId}`)
  console.log(info)
  return 'success'
}

// 自动执行next
function run(gen, ...args) {
  const g = gen(...args)
  function next(data) {
    let result = g.next(data)
    if (result.done) return result.value
    result.value.then(response => response.json()).then(data => next(data))
  }
  next()
}

run(steps, 36301)
```
