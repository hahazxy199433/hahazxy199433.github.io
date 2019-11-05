# express学习(四) 错误处理

错误处理是指Express如何捕获和处理同步和异步发生的错误。Express附带一个默认的错误处理程序，因此无需编写自己的错误处理程序即可开始使用。

## 捕捉错误


确保Express捕获运行路由处理程序和中间件时发生的所有错误非常重要。

路由处理程序和中间件内的同步代码中发生的错误不需要额外的工作。如果同步代码抛出错误，则Express将捕获并处理它

```javascript
app.get("/", function (req, res) {
  throw new Error("BROKEN"); // Express will catch this on its own.
});
```
对于由路由处理程序和中间件调用的异步函数返回的错误，您必须将它们传递给next()函数，Express将捕获并处理它们。

```javascript
app.get("/", function (req, res, next) {
  fs.readFile("/file-does-not-exist", function (err, data) {
    if (err) {
      next(err); // Pass errors to Express.
    }
    else {
      res.send(data);
    }
  });
});
```

## 默认错误处理程序
Express附带了一个内置的错误处理程序，可以处理应用程序中可能遇到的任何错误。此缺省错误处理中间件功能添加在中间件功能堆栈的末尾。

```javascript
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}
```

## 编写错误处理程序

以与其他中间件函数相同的方式定义错误处理中间件函数，除了错误处理函数有四个参数而不是三个：  (err, req, res, next)。

```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

可以在其他app.use()路由调用之后定义错误处理中间件
```javascript

var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(function (err, req, res, next) {
  // logic
})
```

中间件函数内的响应可以是任何格式，例如HTML错误页面，简单消息或JSON字符串。

对于组织（和更高级别的框架）目的，您可以定义多个错误处理中间件函数，就像使用常规中间件函数一样

```javascript
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)
```
