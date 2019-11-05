# javascript基础测试题(三)

## 1.请写出正确的执行结果

```javascript
var bar = 2;
var yideng = {
    bar: function () {
        return this.baz
    },
    baz: 1
};
(function () {
    console.log(typeof arguments[0]());
})(yideng.bar)
```

答案：
undefined

+ 传入实参yideng.bar，arguments[0]() 调用传入的实参，即返回一个this.baz
+ 由于是arguments调用的，所以this指向arguments,arguments没有baz属性
+ 所以typeof 是undefined

## 2.请写出正确的执行结果

```javascript
function test() {
    console.log('out');
};
(function (){
    if (false) {
        function test() {
            console.log('in');
        }
    }
    test();
})()
```

答案：
test is not a function

+ 在立即执行函数中，if判断是false，所以永远不会执行，但是在里面声明了 test 函数，所以test声明会在立即执行函数内变量提升，但是由于执行不到，所以函数未声明。
+ 所以在执行test()时，test 是 undefined。

## 3.请写出正确的执行结果

```javascript
var x = [typeof x, typeof y][1];
typeof x;
```

答案：
"string"

+ 首先由 x = [typeof x, typeof y][1] 得出 x = typeof y；
+ y 未定义，所以typeof y == "undefined" ，所有typeof 的返回值都是字符串;
+ typeof x == typeof typeof y == typeof "undefined" == "string";

## 4.请写出正确的执行结果

```javascript
(function(x) {
    delete x;
    return x;
})(1);
```

答案：
1

+ delete删除的是对象上的属性，不能删除参数
+ 所以返回的依然是1

## 5.请写出正确的执行结果

```javascript
var x = 1;
if (function f() {}) {
    x += typeof f;
}
x;
```

答案： 
"1undefiend"

+ 首先 function f(){} 是个 function 所以在判断条件里是trou，会进入条件分支;
+ 但是在条件分支内并未定义 f ，且在外部也没有f ，所以typeof f 是undefiend;
+ 所以`最后的x 是 "1undefiend";

## 6.请写出正确的执行结果

```javascript
function f() {
    return f;
}

new f() instanceof f;
```

答案：
false

+ em。。。。。。。。。。。。

## 7.请写出正确的执行结果

```javascript
Object.prototype.a = 'a';
Function.prototype.a = 'a1';
function Person() {};
var yideng = new Person();
console.log(yideng.a);
```

答案：
a
+ em.......

## 8.请写出正确的执行结果

```javascript
var yideng = [0];
if (yideng) {
    console.log(yideng == true);
} else {
    console.log("yideng");
}
```

答案：
false

## 9.请写出正确的执行结果

```javascript
function yideng() {
    return {
        a: 1
    }
};
var result = yideng();
console.log(result.a);
```

答案：
1

## 10.(源于阿里面试题)

```javascript
const timeout = ms => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms);
});
const ajax1 = () => timeout(2000).then(() => {
    console.log('1');
    return 1;
});
const ajax2 = () => timeout(1000).then(() => {
    console.log('2');
    return 2;
});
const ajax3 = () => timeout(2000).then(() => {
    console.log('3');
    return 3;
});
const mergePromise = (ajaxArray) => {
    //1,2,3 done [1,2,3] 此处写代码 请写出es6 es3 2种解法
}
mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log("done");
    console.log(data); // data为[1, 2, 3]
});
// 执行结果为： 1 2 3 done [1, 2, 3]
```

