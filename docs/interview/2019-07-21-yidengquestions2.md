# javascript基础测试题(二)
## 1.请手写实现拖拽。

```javascript
    class Drop{
        constructor(selector) {
            this.state = 0;
            this.offsetL = null;
            this.offsetT = null;
            this.div = document.querySelector(selector);
        }
        init() {
            this.div.onmousedown = function (e) {
                this.offsetL = e.offsetX;
                this.offsetT = e.offsetY;
                this.state = 1;
            }
            this.div.onmouseup = function () {
                this.state = 0;
            }
            this.div.onmousemove = function (e) {
                if (this.state === 1) {
                    var clinetX = e.clientX;
                    var clinetY = e.clientY;
                    this.style.left = clinetX - this.offsetL + 'px';
                    this.style.top = clinetY - this.offsetT + 'px';
                }
            }
        }
    }
    const drop = new Drop('#d');
    drop.init();
```

## 2.请实现一个浅拷贝和一个深拷贝。

浅拷贝
```javascript
function simpleClone(json) {
    var obj = {};
    for(var i in json) {
        obj[i] = json[i];
    }
    return obj;
}
 var obj = {
      a: "hello",
      b:{
          a: "world",
          b: 21
        },
      c:["Bob", "Tom", "Jenny"],
      d:function() {
          alert("hello world");
        }
    }
    var cloneObj = simpleClone(obj); 
    console.log(cloneObj.b); 
    console.log(cloneObj.c);
    console.log(cloneObj.d);
    cloneObj.b.a = "changed";
    cloneObj.c = [1, 2, 3];
    cloneObj.d = function() { alert("changed"); };
    console.log(obj.b);
    console.log(obj.c);
    console.log(obj.d);
```

深拷贝
```javascript
function deepClone(json) {
    var obj = {};
    for(var i in json) {
        if (typeof json[i] === 'object') {
            obj[i] = deepClone(json[i]);
        } else {
            obj[i] = json[i];
        }
    }
    return obj;
}
 var obj = {
      a: "hello",
      b:{
          a: "world",
          b: 21
        },
      c:["Bob", "Tom", "Jenny"],
      d:function() {
          alert("hello world");
        }
    }
var cloneObj = deepClone(obj); 
    console.log(cloneObj.b); 
    console.log(cloneObj.c);
    console.log(cloneObj.d);
    cloneObj.b.a = "changed";
    cloneObj.c = [1, 2, 3];
    cloneObj.d = function() { alert("changed"); };
    console.log(obj.b);
    console.log(obj.c);
    console.log(obj.d);
```

## 3.请实现ES5 map方法Polyfill。-

```javascript
 Array.prototype.myMap = function(fn, ctx) {
    let oriArr = Array.prototype.slice.call(this);
    let mappedArr = [];
    for (let i = 0; i < oriArr.length; i++) {
        if (!oriArr.hasOwnProperty(i)) {
            // 若原数组为稀疏数组，不含索引为i的元素时，mappedArr直接增加length，来达到同样的稀疏效果
            mappedArr.length++;
        } else {
            mappedArr.push(fn.call(ctx, oriArr[i], i, this));
        }
    }
    return mappedArr;
};
console.log([1,,,,3].myMap((val) => val + 1))
```

官网实现
```javascript
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. 将O赋值为调用map方法的数组.
    var O = Object(this);

    // 2.将len赋值为数组O的长度.
    var len = O.length >>> 0;

    // 3.如果callback不是函数,则抛出TypeError异常.
    if (Object.prototype.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 5. 创建新数组A,长度为原数组O长度len
    A = new Array(len);

    // 6. 将k赋值为0
    k = 0;

    // 7. 当 k < len 时,执行循环.
    while(k < len) {

      var kValue, mappedValue;

      //遍历O,k为原数组索引
      if (k in O) {

        //kValue为索引k对应的值.
        kValue = O[ k ];

        // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
        mappedValue = callback.call(T, kValue, k, O);

        // 返回值添加到新数组A中.
        A[ k ] = mappedValue;
      }
      // k自增1
      k++;
    }

    // 8. 返回新数组A
    return A;
  };      
}
```

## 4.请实现 instanceof的原理。

```javascript
let newInstanceof = function (leftVal, RightVal) {
    let objProto = leftVal.__proto__;
    while (objProto) {
        if (objProto == RightVal.prototype) {
            return true;
        }
        objProto = objProto.__proto__;
    }
    return false;
}
```

## 5.请实现一个bind函数。

[参考](https://github.com/mqyqingfeng/Blog/issues/12)

```javascript
if (!Funtion.prototype.bind) {
      Funtion.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var args = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fBound ? this : oThis, args.concat(Array.prototype.slice.call(arguments)));
        }
        if (this.prototype) {
          fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();
        return fBound;
      }
    }
```

## 6.请实现一个call函数 

[参考](https://github.com/mqyqingfeng/Blog/issues/11)
```javascript
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
```

## 7.请说明new本质，并写出实现代码 

new 的本质一共做了几件事情

1. 创建了一个空对象；
2. 将实例的__protoy__指向了构造函数的prototype ;
3. 将this绑定到实例上；
4. 返回一个对象；

```javascript
  function _new(fn, ...args) {
    let obj = {};
    // obj.__proto__ = fn.prototype;  与setPrototypeOf 等价，推荐使用setPrototypeOf
    Object.setPrototypeOf(obj, fn.prototype)
    let result = fn.apply(obj, args);
    return result instanceof Object ? result : obj;
}
function Test(name, age) {
  this.name = name;
  this.age = age;
}
Test.prototype.sayName = function () {
  console.log(this.name);
}


let test = _new(Test, 'zxy', 25);
console.log(test.name);
console.log(test.age);
test.sayName()
```

## 8.请实现一个 JSON.stringify 和 JSON.parse