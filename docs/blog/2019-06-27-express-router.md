# express学习(三) 路由


路由是指应用程序的端点（URI）如何响应客户端请求。
```javascript
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
```

## 路由方法

路由方法从其中一个HTTP方法派生，并附加到express类的实例。
```javascript
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
})
```

## 路由路径
路由路径与请求方法结合，定义可以进行请求的端点。路径路径可以是字符串，字符串模式或正则表达式。

字符?，+，*，和()是他们的正则表达式的对应的子集。连字符（-）和点（.）按字面顺序由基于字符串的路径解释。


/index/login
其中第一个是controller,后面的都是action
一个controller可以有多个action


例如

此路由路径将匹配对根路由的请求，/。
```javascript
app.get('/', function (req, res) {
  res.send('root')
})
```

此路径路径将匹配请求/about。
```javascript
app.get('/about', function (req, res) {
  res.send('about')
})
```

此路径路径将匹配请求/random.text。
```javascript
app.get('/random.text', function (req, res) {
  res.send('random.text')
})
```

此路径路径将匹配请求/random.text。
```javascript
app.get('/random.text', function (req, res) {
  res.send('random.text')
})
```
等等



## 路由句柄
可以提供多个回调函数，其行为类似于中间件来处理请求。唯一的例外是这些回调可能会调用next('route')以绕过剩余的路由回调。可以使用此机制对路径施加前置条件，然后在没有理由继续当前路由的情况下将控制权传递给后续路由。


单个回调函数可以处理路由
```javascript
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
```

多个回调函数可以处理路径（确保指定next对象）
```javascript
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})
```

一组回调函数可以处理路由。
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```


独立函数和函数数组的组合可以处理路径。
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
```

## 响应方法

方法 | 描述
---------| -------------
res.download() | 提示下载文件。
res.end() | 结束响应过程。
res.json() | 发送JSON响应。
res.jsonp() | 使用JSONP支持发送JSON响应。
res.redirect() | 重定向请求。
res.render() | 渲染视图模板。
res.send() | 发送各种类型的回复。
res.sendFile() | 将文件作为八位字节流发送。
res.sendStatus() | 设置响应状态代码并将其字符串表示形式作为响应主体发送。

## app.route()
可以使用创建路径路径的可链路径处理程序app.route()。由于路径是在单个位置指定的，因此创建模块化路由很有帮助，同时减少冗余和拼写错误。

```javascript
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```



## express.Router
使用express.Router该类创建模块化，可安装的路由处理程序。一个Router实例是一个完整的中间件和路由系统; 因此，它通常被称为“迷你app”。

```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
```


和app类似
```javascript
var express = require('express');
var app = express();

app.use('*', function(req, res, next) {
  console.log('必经路由');
  next();
})

app.get('/index', function(req, res, next) {
  res.send('index');
});

app.get('/go', function(req, res, next) {
  res.send('go');
});

app.listen(8081, function() {
  console.log('接口已启动');
})
```