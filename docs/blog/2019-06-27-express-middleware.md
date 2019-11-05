# express学习(二) 中间件

## 应用级中间件

应用级中间件绑定到app对象使用app.use()和app.METHOD(),其中，METHOD是需要处理的HTTP请求的方法，例如GET、PUT、POST等等，全部小写。
```javascript
var app = express();
// 没有挂载路由的中间件，应用的每个请求都会执行该中间件
app.use(function(req, res, next){
    console.log('Time', Date.now());
    next();
})
// 挂载至/user/:id的中间件，应用的每个请求都会执行该中间件
app.use('/use/:id', function(req, res, next){
    console.log('Request Type:', req.mothod);
    next();
})

// 路由和句柄函数（中间件系统），处理指向/user/:id的GET请求
app.get('/user/:id', function(req, res, next) {
    res.send('USER');
})
```

下面的这个例子展示了在一个挂载点装载一组中间件。
```javascript
// 一个中间件栈，对任何指向/user/:id 的HTTP请求打印出相关信息
app.use('/user/:id', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function(req, res, next) {
    console.log('Request Type:', req.method);
    next();
});
```


## 路由级中间件
路由器级中间件的工作方式与应用程序级中间件的工作方式相同，只不过它被绑定到一个实例express.Router()。
```javascript
//router中间件和app中间件处理的情况一样
var router = express.Router()
```

```javascript
var app = express()
var router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)
```


## 错误处理中间件

以与其他中间件函数相同的方式定义错误处理中间件函数，除了四个参数而不是三个，特别是签名(err, req, res, next)）：

```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

## 内置中间件
从版本4.x开始，Express不再依赖于Connect。之前包含在Express中的中间件功能现在位于不同的模块中; 查看中间件功能列表。

Express具有以下内置中间件功能：

+ express.static提供静态资产，如HTML文件，图像等。
+ express.json使用JSON有效负载解析传入的请求。注意：适用于Express 4.16.0+
+ express.urlencoded使用URL编码的有效负载解析传入的请求。 注意：适用于Express 4.16.0+


## 第三方中间件

使用第三方中间件为Express应用程序添加功能。

安装Node.js模块以获得所需的功能，然后在应用程序级别或路由器级别将其加载到您的应用程序中。

以cookie-parser为例
```javascript
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')

// 加载第三方中间件
app.use(cookieParser())
app.use(function(req, res, next) {
    req.cookies = function() {
        return {
            data:123
        }
    }
})
app.get('/index', function(req, res, next) {
    console.log(req.cookies().data);
})
app.listen(8081, function() {
    console.log("接口已启动")
})
```