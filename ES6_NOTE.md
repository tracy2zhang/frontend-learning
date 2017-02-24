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
