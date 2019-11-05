# javascript基础测试题(一)


## 1.请写出弹出值，并解释为什么

```javascript
alert(a); 
a(); 
var a = 3;
function a() {
    alert(10);
}
alert(a); 
a = 6;
a(); 
```

答案：
function a() {alert(10)}
10
3
a is not a function

发生了变量提升和函数提升
题目实际预编译时如下
```javascript
var a; // 变量提升，在最上面声明
function a() { // 函数提升，直接剪切过来定义
    alert(10);
}
alert(a); // 此时a是函数
a(); //执行函数
a = 3; // 给a赋值为3
alert(a);  // 输出3
a = 6; // 赋值为6
a(); // 此时a是6，不是函数所以 not a funtion
```


## 2.请写出如下输出值，并写出把注释掉的代码取消注释的值，并解释为什么

取消注释前：
```javascript
this.a = 20;
var test = {
    a: 40,
    init: () => {
        console.log(this.a);
        function go() {
            console.log(this.a);
        }
        go.prototype.a = 50;
        return go;
    }
};
new(test.init())();
```

答案：
20
50

+ 首先test.init()执行后，先输出this.a，因为init是箭头函数，此时this指向全局，即this.a = 20
+ 然后test.init()返回go
+ 即new go();
+ go通过闭包得到，所以go里面的this指向go
+ go的原型链上挂了a   go.prototype.a = 50
+ 所以new go() 输出50


取消注释后：
```javascript
this.a = 20;
var test = {
    a: 40,
    init: () => {
        console.log(this.a);
        function go() {
            this.a = 60;
            console.log(this.a);
        }
        go.prototype.a = 50;
        return go;
    }
};
var p = test.init();
p();
new(test.init())();
```
答案：
20
60
60
60

+ 首先执行test.init() this指向全局， 输出this.a 为 20，最后返回一个go，即p = go;
+ 然后执行p() 即 go() ,此时由window执行go，所以this指向window，在go内执行this.a = 60,即改变了window的a, this.a = 60   所以输出60
+ 然后执行 test.init()  this指向全局，此时全局的a已经变成了60，所以输出60
+ 现在变成了 new go()  此时go作为原型，this指向自身，会先找自身的a,如果没有才会继续在原型链上找，所以输出60

## 3.输出什么

```javascript
var num = 1;
function yideng() {
    "use strict";
    console.log(this.num++);
}
function yideng2() {
    console.log(++this.num);
}
(function () {
   "use strict";
   yideng2();
})()
yideng();
```

答案：
2
Cannot read property 'num' of undefined

+ 首先两个函数是在全局作用域严格模式之前声明的，yideng函数里面进行了严格模式，所以里面的this是undefined，而yideng2里没有进行严格模式，所以里面的this指向window。
+ 当执行立即执行函数之后，yideng2内部没有影响，所以指向全局的num++，后面的yideng内部已经是严格模式了所以输出undefined。
+ 如果yideng2在"use strict"之后声明，则也将进入严格模式。
+ 参考[阮大哥](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)


##  4.请写出以下代码执行结果： 

```javascript
function C1(name) {
    if (name) this.name = name;
}
function C2(name) {
    this.name = name;
}
function C3(name) {
    this.name = name || 'fe';
}
C1.prototype.name = 'yideng';
C2.prototype.name = 'lao';
C3.prototype.name = 'yuan';
console.log((new C1().name) + (new C2().name) + (new C3().name));
```

答案：
'yidengundefinedfe'

+ C1中通过有无name进行判断，没有输入的话this就没有挂载name属性，在实例化之后调用name，会继续在原型链上查找name属性，所以输出'yideng';
+ C2中定义了name属性，当实例化时没有传入参数，那么this.name = undefined，不会继续到原型链上查找；
+ C3中也定义了name属性，如果传入了参数，那么name就等于传入的参数，如果没有传入，则等于'fe'，同样不会到原型链上查找。


##  5.请写出如下点击li的输出值，并用三种办法正确输出li里的数字：

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>6</li>
</ul>
<script>
    var list_li = document.getElementsByTagName("li");
    for (var i = 0; i < list_li.length; i++) {
        list_li[i].onclick = function() {
            console.log(i);
        }
    }
</script>
```

答案：
全部输出6

方法一： 
使用es6 块级作用域
```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>6</li>
</ul>
<script>
    var list_li = document.getElementsByTagName("li");
    for (let i = 0; i < list_li.length; i++) {
        list_li[i].onclick = function() {
            console.log(i + 1);
        }
    }
</script>
```

方法二：
使用闭包
```html
<ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
      </ul>
      <script>
          var list_li = document.getElementsByTagName("li");
          for (var i = 0; i < list_li.length; i++) {
              (function(i){
                list_li[i].onclick = function() {
                  console.log(i + 1);
                }
              })(i) 
          }
      </script>
```

方法三：
给每一个元素添加一个属性来存储i
```html
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
  </ul>
  <script>
      var list_li = document.getElementsByTagName("li");
      for (var i = 0; i < list_li.length; i++) {
        var item = list_li[i];
        item.index = i;
        item.onclick = function() {
          console.log(this.index + 1);
        } 
      }
  </script>
```

方法四：
this
```html
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
  </ul>
  <script>
      var list_li = document.getElementsByTagName("li");
    for (var i = 0; i < list_li.length; i++) {
        list_li[i].onclick = function() {
            console.log(this.innerHTML);
        }
    }
  </script>
```

## 6.写出输出值，并解释为什么。

```javascript
function test(m) {
    m = {v: 5}
}
var m = {k: 30};
test(m);
alert(m.v);
```

答案：
undefined 
+ 因为重写了对象，如果函数内是 m.v = 5 则可以输出5

## 7.请写出代码执行结果，并解释为什么？

```javascript
function yideng() {
    console.log(1);
}
(function (){
    if (false) {
        function yideng() {
            console.log(2);
        }
    }
    yideng();
})()
```
答案：
yideng is not a function

+ 因为第二个 yideng 变量提升，由于有if语句判断，所以只是将变量 yideng 提升上去并覆盖第一个声明的yideng，所以执行时，yideng是undefined。


## 8.请用一句话算出0-100之间学生的学生等级，如90-100输出为1等生、80-90为2等生以此类推。不允许使用if switch等。

答案：

```javascript
const student = (num) => num > 0 && num <= 100 ? 10 - Math.floor((num - 1) / 10) : 0
```

## 9.请用一句话遍历变量a。(禁止用for 已知var a = “abc”)

答案：


```javascript
[..."abc"]
```

## 10.请在下面写出JavaScript面向对象编程的混合式继承。并写出ES6版本的继承。要求：汽车是父类，Cruze是子类。父类有颜色、价格属性，有售卖的方法。Cruze子 类实现父类颜色是红色，价格是140000,售卖方法实现输出如下语句：将 红色的 Cruze买给了小王价格是14万。

es6：
```javascript
class Car{
    constructor(color, price) {
        this.color = color;
        this.price = price;
    }
    sell() {
        console.log(`将${this.color}的卖给了价格是${this.price}`)
    }
}
class Cruze extends Car{
    constructor(carname, name) {
        super('红色', '140000');
        this.carname = carname;
        this.name = name;
    }
    sell() {
        console.log(`将${this.color}的${this.carname}卖给了${this.name}价格是${this.price}`)
    }
}
let a = new Cruze('Cruze', '小王');
a.sell()
```


## 11.请你写出如何利用EcmaScript6/7（小Demo）优化多步异步嵌套的代码？

答案：

es6
```javascript
new Promise((resolve, reject) => {
    //...
    resolve();
}).then((res) => {
    //...
}).then((res) => {
    //...
})
```

es7
```javascript
async () => {
    await ...
    await ...
    await ...
}
```

## 12.【仔细思考】写出如下代码执行结果，并解释为什么。

```javascript
var length = 10;
function fn() {
    console.log(this.length);
}
var yideng = {
    length: 5,
    method: function (fn) {
        fn();
        arguments[0]();
    }
};
yideng.method(fn, 1);
```

答案：
10
2

+ 先执行传入的fn，此时是window在调用，所以fn内部的this指向window,所以输出10
+ 然后执行 arguments[0]() , arguments是一个类数组对象，输出可以看到 arguments = {0: fn, 1: 1}
+ 所以arguments[0]() 即相当于arguments在调用fn，所以fn的this指向arguments，而yideng.method(fn, 1)，传入了两个参数，即arguments.length 是 2，所以输出2。
+ 如果运行的是yideng.method(fn, 1, 2) 则arguments有三个参数，输出的便是3
+ window.length 是 iframe 的个数




## 13.输出什么。

```javascript
var a = "item";
var b = ["item", "str", "sub"];
a in b
```

答案：
false

+ a in b 查找的是数组的 key 
+ 如果是 0 in b 则是true


## 14.

```javascript
   {
     function yideng() {
       yideng = 1;
       console.log(typeof yideng)// number
       return yideng;
     }
     yideng();
     console.log(typeof yideng)// number
   }
   console.log(typeof yideng) // function
```
+ 在函数里可以自己重写函数名

```javascript
{
     var yideng = function yideng1() {
       yideng1 = 1;
       console.log(yideng1) // function
     }
     yideng();
     console.log(typeof yideng)// function
   }
   console.log(typeof yideng)// function
```

+ 在表达式（var）里就不能自己重写函数名了