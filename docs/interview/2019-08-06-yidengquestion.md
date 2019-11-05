# javascript基础测试题(四)


## 1.请写出如下代码输出值，并解释为什么。

```javascript
console.log(a);
console.log(typeof yideng(a));
var flag = true;
if (flag) {
  var a = 1;
}
if (flag) {
  function yideng(a) {
    yideng = a;
    console.log("yideng1");
  }
} else {
  function yideng(a) {
    yideng = a;
    console.log("yideng2");
  }
}
```

答案：

undefiend
yideng is not a function

+ JavaScript的代码执行经历了三个阶段：语法分析、预编译、解释执行。
+ 而在预编译阶段就是对作用域中变量(函数及非函数)的确定。在全局环境下，预编译有三个阶段：
1. 创建GO对象
2. 找变量声明，把变量声明作为GO的属性名，值为undefined
3. 找函数声明，把函数声明作为G的属性名，并把函数体作为属性值赋予函数名。
+ 除这几步之外我们还必须要知道如果**函数声明在if/else语句块中的话，函数声明会先转化为函数表达式**，然后对函数表达式进行变量声明。
+ 所以在执行时，a = undefined, yideng = undefined


## 2.请写出如下输出值

```javascript
function fn() {
  console.log(this.length);
}
var yideng = {
  length: 5,
  method: function () {
    "use strict";
    fn();
    arguments[0]()
  }
}
const result = yideng.method.bind(null);
result(fn, 1);
```

答案：
0
2
+ result = yideng.method.bind(null) 将method方法this指向了window,在执行时，fn()的this就指向window,this.length == window.length == iframe的个数 == 0
+ arguments[0]()执行的是一个参数 fn ，此时this指向了 arguments, this.length == arguments.length == 2;

## 3.请写出如下输出值

```javascript
function yideng(a,b,c){
    console.log(this.length);
    console.log(this.callee.length);
}
function fn(d){
    arguments[0](10,20,30,40,50);
}
fn(yideng,10,20,30);
```

答案：
4
1

+ 首先执行fn, arguments[0] == yideng,所以执行yideng(10, 20, 30, 40, 50);
+ 此时yideng()的this指向执行它的fn.arguments, 所以 this.length == fn.arguments.length == 4;
+ this.callee == fn.arguments.callee == fn, 所以 this.callee.length == fn.length == 1;


## 4.请问变量a会被GC回收么，为什么呢？

```javascript
function test(){
  var a = "yideng";
  return function(){
    eval("");
  }
}
test()();
```
答案：
+ 不会回收
+ 因为返回到外面执行了eval(""), 不知道还会不会用到变量 a ，所以GC不会回收 a

```javascript
function Yideng(name){
  this.name = name;
}
let student1 = new Yideng();
let student2 = new Yideng();
// 使用浏览器的Memory来查看是否回收，其中 Distance 是距离GC的距离
// 此时GC还没有回收，栈内有两个Yideng，
student1 = null;
// 将其中一个置空释放后，便会回收一个，此时只有一个Yideng
```

```javascript
function Yideng(name) {
  this.name = name; 
}
let YIdengFactory = function (name) {
  let student1 = new Yideng(name);
  return function() {
    console.log(student1);
  }
}
let p1 = YIdengFactory("老袁");
p1();
// 由于闭包，此时 Yideng 的 Distance 是6
// 尝试像上例中一样置空
p1 = null;
// 可以看到，距离根节点 distance 确实是没有了，但是Yideng这个变量还在。
```
上面两个例子说明了，闭包里的变量一旦被引用，就不会被GC。那么继续看原题。

```javascript
function test(){
  var a = "yideng";
  return function(){
    eval(""); 
    // 如果没有eval的话，变量a根本不会进来，eval占住了a,使得a不能被回收。
    // 虽然eval没有引用它，因为eval自己也不知道里面是什么。
    // 在同一词法作用域内声明的变量都会被eval占住无法GC。
    // 可以将eval跳出当前词法作用域， window.eval() 此时就不会占用a了
  }
}
test()();
```

**归纳总结**
1. eval 不对 LexicalEnvironment(全局词法作用域)进行任何的解绑
2. new Function("") 会将范围绑定到全局词法作用域, 如果里面不带"" 则不会，如下面的例子
3. 遇到with, 放弃全部变量的回收 大坑！
4. try..catch(ex) 不会回收ex ex延长了词法作用域的链


```javascript
var test = "outter";
function init() {
  var test = "inner";
  var fn = new Funtion("console.log(test)");
  var fn1 = new Funtion(console.log(test));
  fn(); // outter
  fn1(); // inner
}
init();
```
```javascript
var outter = {
  age:20
}
with(outter) {
  name = "京程一灯";
}
console.log(outter.name); // undefined
console.log(name); // "京程一灯"
```

## 5.清写出以下代码输出值，并解释原因。

Object.prototype 和 Function.prototype 打印的内容差距很大原因是什么呢？
```javascript
Object.prototype.a = 'a';
Function.prototype.a = 'a1';
function Person(){};
var yideng = new Person();
console.log(Person.a); //a1
console.log(yideng.a); //a
console.log(1..a); // a
console.log(1.a); // 报错
console.log(yideng.__proto__.__proto__.constructor.constructor.constructor);
```
先放一张神图

![神图](/interview/20190812-yuanxinglian.jpeg)

+ Person.a 在Person 上没有挂载 a, 那么就会通过__proto__向上去找，从神图中可以看到，向上一级会到 Funtion.prototype 去找，也就是 aj
+ yideng.a，通过Person 创建的实例，通常讲，我们会认为，一个小函数应该是由大函数的儿子，顺着原型链应该去找Funtion才对，但是并非如此，在神图中我们可以看到，实例会顺着__proto__去Person.prototype 找，但是没有，于是继续顺着__proto__找到了 Object.prototype 所以输出 a
+ 1..a js中万物皆是对象，1是numer也是对象，1. == 1，所以 1..a 就会找Object.prototype的a 即输出a 
+ 1.a 会报错，由于浮点数的缘故，1.会优先认为是1.0即1的一部分，也就是1.a会被认为是 1a 所以会报错
+ 这一段就非常绕了。yideng.__proto__找到Foo.prototype, 再找__proto__到Object.prototype, 再找constructor 到Object, 再往下，如果前面这一段截止,new 一下的话，接着会顺着原型链往上找，也就是找到Object.prototype,但是本题没有new,那么Object的constructor就会顺着__proto__去找构造它的，（Object created by Function）,找到了Function.prototype, 再继续找constructor即找到了Function, 再接下来，这里有一个点，就是Function的__proto__是Function.prototype,也就是说Function再继续沿着__proto__去找constructor的话又找到了Function.prototype, 如此下去循环。








## 6.请在下面写出JavaScript面向对象编程的混合式继承。并写出ES6版本的继承。要求：汽车是父类，Cruze是子类。父类有颜色、价格属性，有售卖的方法。Cruze子 类实现父类颜色是红色，价格是140000,售卖方法实现输出如下语句：将 红色的 Cruze买给了小王价格是14万。很多库里会使用Object.create(null)是什么原因么？

```javascript
function Car(color, price) {
  this.color = color;
  this.price = price;
}
Car.prototype.sail = function () {
  console.log("将" + this.color + "的Cruze卖给了小王价格是" + this.price);
}

function Cruze(color, price) {
  Car.call(this, color, price);
}
var __proto = Object.create(Car.prototype);
__proto.constructor = Cruze;
Cruze.prototype = __proto;
var cruze = new Cruze('红色', '140000');
cruze.sail();
```
ES6
```javascript
class Car {
  constructor(color, price) {
    this.color = color;
    this.price = price;
  }
  sail() {
    console.log("将" + this.color + "的Cruze卖给了小王价格是" + this.price);
  }
}

class Cruze extends Car {
  constructor(color, price) {
    super(color, price); // super 并不代表父类
    super.title = '测试'; // 如果像这样直接调用，则相当于this
    this.color = color;
    this.price = price;
  }
}

var cruze = new Cruze('红色', '140000');
cruze.sail();

console.log(cruze.title); // 测试
var car = new Car();
console.log(car.title); // undefined
```
 **es6的class就是原型链的语法糖**


## 7.请写出你了解的ES6元编程。

+ Symbol

```javascript
// Symbol.toPrimitive 指向一个方法，转换成原始类型的时候会调用
var yideng = {
  [Symbol.toPrimitive]: ((i) => () => ++i)(0)
}

if (yideng == 1 && yideng == 2 && yideng == 3) {
  console.log("执行");
}
```

+ Reflect

es6本身的Reflect并不太好，引入一个库 reflect-metadata

```javascript
require('reflect-metadata');
class Yideng {

}
const key = Symbol.for("xx"); // 防止key重复
Reflect.defineMetadata(key, "目标值", Yideng);
let result = Reflect.getMetadata(key, Yideng);
console.log("reflect-metadata获取元数据", result); // reflect-metadata获取元数据目标值
```


+ TCO的尾递归调用优化

```javascript
function test(i) {
  // 开启TCO尾递归调用优化
  return test(i--, i);
  TCO_ENDABLED = true;
}
test(5);
```

+ 代理和反射

```javascript
let laoyuan = {
  age: 20;
}
const validator = { 
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  }
  set(target, key, value) {
    if (typeof value != "number") {
      throw new Error("年龄必须是数字");
    }
  }
}
const proxy = new Proxy(laoyuan, validator);
proxy.age = "京程一灯"; // error 年龄必须是数字
```

## 8.请按照下方要求作答，并解释原理？请解释下babel编译后的async原理

```javascript
let a = 0;
let yideng = async () => {
  a = a + await 10;
  console.log(a)
}
yideng();
console.log(++a); 
```

答案：
1
10
+ async await 其实是generator的语法糖，它有一个特性就是在进入后会所住变量，也就是a = a + await 10 时，a == 0，此时a 的状态被锁住，在后面同步执行完后，再执行内部的步骤，a = 0 + 10 = 10

## 9.请问点击 button 会有反应么？为什么？能解决么？

```javascript
$('#test').click(function(argument) {
  console.log(1);
});
setTimeout(function() {
  console.log(2);
}, 0);
while (true) {
  console.log(Math.random());
}
```

卡死
首先异步任务先放入异步队列中，然后同步执行while(true)，此时同步队列被阻塞住，异步队列的东西就不会被放入同步队列执行，所以卡死不会有反应。
解决方案javascript多线程
1. Thread.js
2. 用本身的多线程
创建task.js
```javascript
while (true) {
  postMessage(Math.random());
}
```

```javascript
$('#test').click(function(argument) {
  console.log(1);
});
setTimeout(function() {
  console.log(2);
}, 0);
var worker = new Worker('task.js');
worker.onmessage = function (event) {
  console.log(event.data);
}
```
然后起一个服务，执行文件，ok,但是还是会站用那个比较多的系统资源



## 10.请先书写如下代码执行结果，并用ES5实现ES6 Promise A+规范的代码，同时你能解 释下如何使用Promise完成事物的操作么？

```javascript
 const pro = new Promise((resolve, reject) => {
    const innerpro = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        })
        console.log(2);
        resolve(3);
    })
    innerpro.then(res => console.log(res));
    resolve(4);
    console.log("yideng");
})
pro.then(res => console.log(res));
console.log("end");

```

答案：
2
yideng
end
3
4

es5实现promise[参考](https://zhuanlan.zhihu.com/p/21834559)
```javascript
function Promise(executor) {
  var _self = this;
  _self.status = 'pending';
  _self.data = undefiend;
  _self.onResolvedCallback = [];
  _self.onRejectedCallback  = [];
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    setTimeout(function() {
      if (_self.status === 'pending') {
      _self.status = 'resolved';
      _self.data = value;
      for(var i = 0; i < onResolvedCallback.length; i++) {
        _self.onResolvedCallback[i](value);
      }
    }
    });
  }
  function reject(reason) {
    setTimeout(function () {
      if (_self.status === 'pending') {
      _self.status = 'rejected';
      _self.data = reason;
      for(var i = 0; i < onRejectedCallback.length; i++) {
        _self.onRejectedCallback[i](reason);
      }
    }
    })
  }
  try{
    executor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') { //because x could resolved by a Promise Object
      x.then(function(v) {
        resolvePromise(promise2, v, resolve, reject)
      }, reject)
    } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
      x.then(resolve, reject)
    }
    return
  }

  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then //because x.then could be a getter
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}
Promise.prototype.then = function (onResolved, onRejected) {
  var _self = this;
  var promise2;
  onResolved = typeof onResolved === 'function' ? onResolved : function(value) {return value}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason}

  if (_self.status === 'resolved') {
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try{
        var x = onResolved(_self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
        resolve(x);
      } catch (e) {
        reject(e);
      }
      })
    })
  }
  if (_self.status === 'rejected') {
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try{
        var x = onRejected(_self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
      })
    })
  }
  if (self.status === 'pending') {
    return promise2 = new Promise(function(resolve, reject) {
      _self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (r) {
          reject(r)
        }
      })
      _self.onRejectedCallback.push(function(reason) {
        try {
            var x = onRejected(reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (r) {
            reject(r)
          }
      })
    })
  }
}
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}
Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
```


## 11.请写出如下输出值，并解释为什么。

```javascript
var s = [];
var arr = s;
for (var i = 0; i < 3; i++) {
  var pusher = {
    value: "item"+i
    },
    tmp;
  if (i !== 2) {
    tmp = []
    pusher.children = tmp
  }                                       
  arr.push(pusher);                       
  arr = tmp;                              
}
console.log(s[0]);
```
答案：
{
  value: "item0",
  children: [
    {
      value: "item1",
      children: [
        value: "item2"
      ]
    }
  ]
}

+ 数组是引用传递，也就是 a = s, a 会指向 s 的变量地址
+ 第一轮循环时，i = 0, pusher = {value: "item0", children = tmp == []}, 此时 tmp 创建了一个新的变量空间，arr 将 pusher push进去后，arr 也就是 s = [{value: "item0", children: []}] , 然后 arr 又指向了新的变量空间 tmp 创建的 [], 即 s[0] 的children
+ 第二轮循环时，i = 1, pusher = {value: "item1", children = tmp == []}, 此时 tmp 又创建了一个新的变量空间，与上一步相同，此时 s = [{value: "item0", children: [{value: "item1", children: []}]}], arr 又指向了 s[0].children[0].children
+ 第三轮循环时，i = 2, pusher = {value: "item2"}, 此时不满足分支条件，所以没有children, 根据上述步骤进行存储后，i++ 跳出循环，此时 s = [{value: "item0", children = tmp == [{value: "item1", children: [{value: "item2"}]}]}]

## 12.请描述你理解的函数式编程，并书写如下代码结果。那么你能使用 Zone+RX 写出一段FRP的代码么？

```javascript
var Container = function(x) {
  this.__value = x;
}
Container.of = x => new Container(x);
Container.prototype.map = function(f){
  return Container.of(f(this.__value))
}
Container.of(3)
  .map(x => x + 1)
  .map(x => 'Result is ' + x);
```