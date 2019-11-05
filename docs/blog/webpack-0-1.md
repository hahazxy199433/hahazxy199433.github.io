# webpack4 从0到1搭建

## 基本配置

### 1. 初始化项目

```
npm init -y
```

### 2. 安装 webpack 及相关插件

```
npm install webpack webpack-cli --save-dev
```

### 3. 创建基本的目录结构
+ 创建 src 文件夹
+ src下创建 server 和 web 文件夹
+ web 下创建 index.js 作为主入口

### 4. 根目录创建webpack.config.js

webpack.config.js
```js
module.exports = {
    entry: './src/web/index.js'
}
```

### 5. 使用 scripty 进行命令控制

安装 scripty
```
npm install scripty --save-dev
```

根目录创建 scripts-win 文件夹(如果是mac可直接创建scripts)
scripts 下创建 client 文件夹
client 下创建 dev.bat  prod.bat server.bat  (如果是mac则对应后缀都是.sh)

将 npm 命令写入脚本:

dev.bat
```
webpack --mode development
```

prod.bat
```
webpack --mode production
```

server.bat
```
webpack-dev-server --mode development
```

再在package.json 中进行配置

```json
{
  "scripts": {
    "client:dev": "scripty",
    "client:prod": "scripty",
    "client:server": "scripty"
  },
}
```
此时再运行npm命令就可以了，此时可以测试一下简单的打包是否正常

### 6. 将webpack按照开发环境和上线环境进行配置

在根目录创建 config 文件夹
分别创建 webpack.development.js 和 webpack.production.js 暂时导出为空
顺便根据不同的环境配置 sourcemap

webpack.development.js
```js
module.exports = {
    devtool: 'cheap-module-eval-source-map',
}
```

webpack.production.js
```js
module.exports = {
    devtool: 'cheap-module-source-map',
}
```

通过 yargs-parser 获取用户参数
通过 webpack-merge 对不同的config进行合并

安装 webpack-merge 和 yargs-parser
```
npm install webpack-merge yargs-parser --save-dev
```

在webpack.config.js 中进行配置
```js
const argv = require('yargs-parser')(process.argv.slice(2));  // 获取用户输入参数
const _mode = argv.mode || 'development'; // 获取参数是上线还是开发环境
const merge = require('webpack-merge');
const _mergeConfig = require(`./config/webpack.${_mode}.js`); // 根据不同的环境引入不同的webpack配置项

const webpackConfig = {
    entry: './src/web/index.js'
}

module.exports = merge(_mergeConfig, webpackConfig);
```

到目前为止，基本的一些东西配置完成了
接下来根据后面的优化部分先配置一下开发时的优化

### 7. 一些花里胡哨的配置

**监控面板：  speed-measure-webpack-plugin**
在打包的时候显示出每一个loader,plugin所用的时间，来精准优化
```
npm install speed-measure-webpack-plugin --save-dev
```

webpack.config.js
```js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(_mergeConfig, webpackConfig)); // 用 smp.wrap 包裹一下
```

**开启一个通知面板：  webpack-build-notifier**

```
npm install webpack-build-notifier --save-dev
```

webpack.config.js
```js

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const webpackConfig= {
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: '我的webpack',  // 可以起一个项目名字
            // logo: path.resolve('./img/favicon.png'),  // 可以找一个好看的小图标
            suppressSuccess: true // 显示成功
        })
    ]
}
```

**开启打包进度：progress-bar-webpack-plugin**

```
npm install progress-bar-webpack-plugin --save-dev
```

webpack.config.js
```js
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const webpackConfig= {
    plugins: [
        new ProgressBarPlugin(),
    ]
}
```

**友好提示：friendly-errors-webpack-plugin**

```
npm install friendly-errors-webpack-plugin --save-dev
```

```js
new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
              messages: ['You application is running here http://localhost:3000'],
              notes: ['Some additionnal notes to be displayed unpon successful compilation']
            },
            onErrors: function (severity, errors) {
              // You can listen to errors transformed and prioritized by the plugin
              // severity can be 'error' or 'warning'
            },
            // should the console be cleared between each compilation?
            // default is true
            clearConsole: true,
           
            // add formatters and transformers (see below)
            additionalFormatters: [],
            additionalTransformers: []
          }),
```

接下来干点正事

### 8. 页面插入及清除

现在我们只是在dist创建html来进行测试，这很不好
所以接下来进行页面的动态插入

安装 html-webpack-plugin 和 clean-webpack-plugin
```
npm install html-webpack-plugin clean-webpack-plugin --save-dev
```

引入插件
webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const loading = {
    html: '加载中'
}

const webpackConfig= {
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/web/index.html',
            loading
        }),
        new CleanWebpackPlugin(),
    ]
}
```
这样每次重新打包的时候都会自动清除dist中的内容，然后将js 和 css 自动插入到html 中并复制到 dist

### 9. 然后再处理处理CSS
安装 mini-css-extract-plugin 插件，用来打包css
```
npm install mini-css-extract-plugin --save-dev
```

安装 postcss-loader postcss-preset-env 和 less-loader less
(如果用less的话，其实用了postcss就不需要再用less了)
```
npm install postcss-loader postcss-preset-env less-loader less --save-dev
```

在根目录创建 postcss.config.js
```js
module.exports = {
    plugins: {
        'postcss-preset-env': {
            browsers: 'last 2 versions',
            stage:0,
            features:{
                'nesting-rules': true
            }
        }
    }
}
```

配置webpack.config.js
配置loader的时候需要注意顺序，从下到上进行解析
```js
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig= {
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: _modeflag ? 'styles/[name].[hash:5].css':'styles/[name].css',
            chunkFilename: _modeflag ? 'styles/[id].[hash:5].css':'styles/[id].css'
        }),
    ]
}
```

### 10. 抽离公共代码 runtime


```js
const webpackConfig= {
    optimization:{
        splitChunks:{
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    name: 'common',
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0
                }
            }
        },
        runtimeChunk:{
            name: 'runtime'
        }
    },
}
```

### 11. 接下来分别配置一下开发环境和上线环境的文件

**开发环境**
每次打包然后再看效果这样效率很低，所以安装 webpack-dev-server 启动热更新
```
npm install webpack-dev-server --save-dev
```

webpack.development.js
```js
module.exports = {
    devServer: {
        historyApiFallback: true,
        port: 3000, // 端口号
        hot: true, // 开启热更新
        open: true // 自动打开浏览器
    },
    output:{
        filename: 'script/[name].bundles.js', // 指定一下打包文件的输出地址
    }
}
```


**上线环境**
配置上线环境的webpack项主要考虑的是一些压缩合并，可以结合后面的优化部分进行

安装 webpack-parallel-uglify-plugin 进行多核打包同时对js进行压缩，不适合小项目
```
npm install webpack-parallel-uglify-plugin --save-dev
```

webpack.production.js
```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const os = require('os');

module.exports = {
    output:{
        filename: 'script/[name].[hash:5].bundles.js',
        publicPath:'/'
    },
    plugins:[
        new ParallelUglifyPlugin({
            exclude: /\.min\.js$/,
            workerCount: os.cpus().length,
            /* uglifyJS: {

            }, */
            uglifyES: {
                output: {
                    beautify:false,
                    comments: false,
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true
                }
            }
        })
    ],
}
```

对css进行压缩
```
npm install optimize-css-assets-webpack-plugin --save-dev
```
webpack.production.js
```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    plugins:[
        new OptimizeCSSAssetsPlugin({}),
    ],
}
```

### 12. 添加 manifest.json

根据后面优化的内容，生成 manifest.json
用来做映射缓存，可以减少请求的资源

webpack.config.js
```js
const ManifestPlugin = require('webpack-manifest-plugin');

const webpackConfig= {
    plugins: [
        new ManifestPlugin(),
    ]
}
```

至此一个最最基本的配置已经完成了
接下来继续配置成我们实际项目所需的东西


### 13. 添加 react

安装react相关
```
npm install react react-dom react-router-dom --save-dev
```

安装babel相关
```
npm install babel-loader @babel/core @babel/preset-env @babel/preset-react
```

webpack.config.js添加babel-loader
```js
const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
}
```
创建.babelrc
```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```






## 优化

### 开发阶段
#### 1. 开启多核压缩
```
npm install uglifyjs-webpack-plugin --save-dev
```


webpack.production.js
```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [new UglifyJsPlugin({
            parallel: true
        })]
    }
}
```
但是这个使用的时候会报错，好像是不能转es6的问题
代替方案是 terser-webpack-plugin
```js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ]
    }
}
```


#### 2. 监控面板

在打包的时候显示出每一个loader,plugin所用的时间，来精准优化
```
npm install speed-measure-webpack-plugin --save-dev
```

webpack.config.js
```js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
//............
// 用smp.warp()包裹一下合并的config
module.exports = smp.wrap(merge(_mergeConfig, webpackConfig));
```

#### 3. 开启一个通知面板

```
npm install webpack-build-notifier --save-dev
```

webpack.config.js
```js

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const webpackConfig= {
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: '我的webpack',
            // logo: path.resolve('./img/favicon.png'),
            suppressSuccess: true
        })
    ]
}
```

#### 4. 开启打包进度

```
npm install progress-bar-webpack-plugin --save-dev
```

webpack.config.js
```js
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const webpackConfig= {
    plugins: [
        new ProgressBarPlugin(),
    ]
}
```

#### 5. 开发面板更清晰

```
npm install webpack-dashboard --save-dev
```

webpack.config.js
```js
const DashboardPlugin = require('webpack-dashboard/plugin');

const webpackConfig= {
    plugins: [
        new DashboardPlugin()
        ]
}
```

package.json
```json
{
  "scripts": {
    "dev": "webpack-dashboard webpack --mode development",
  },
}

```

#### 6. 开启窗口的标题
这个包mac的item用有效果，windows暂时没看到效果
```
node-bash-title
```

webpack.config.js
```js
const setTitle = require('node-bash-title');
setTitle('server');
```

#### 7. friendly-errors-webpack-plugin

```
npm install friendly-errors-webpack-plugin --save-dev
```

```js
new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
              messages: ['You application is running here http://localhost:3000'],
              notes: ['Some additionnal notes to be displayed unpon successful compilation']
            },
            onErrors: function (severity, errors) {
              // You can listen to errors transformed and prioritized by the plugin
              // severity can be 'error' or 'warning'
            },
            // should the console be cleared between each compilation?
            // default is true
            clearConsole: true,
           
            // add formatters and transformers (see below)
            additionalFormatters: [],
            additionalTransformers: []
          }),
```







### 上线阶段

#### 1. es6不需要编译

#### 2. 前端缓存小负载
    a.js -> a.xxx.js
    a.xxx.js -> 代码 后台每次计算出当前包

会在dist中生成一个manifest.json文件，用来缓存

```js
const ManifestPlugin = require('webpack-manifest-plugin');

const webpackConfig= {
    plugins: [
        new ManifestPlugin(),
    ]
}
```

#### 3. 加loading

```html
<body>
    <div id="app">
        <%= htmlWebpackPlugin.options.loading.html %>
    </div>
</body>
```

webpack.config.js
```js
const loading = {
    html: '加载中。。。'
}

const webpackConfig= {
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/index.html',
            loading
        }),
    ]
}

```

在sync.js中添加个延迟效果
```js
// import lodash from 'lodash-es';
import {isArray} from 'lodash-es';
import item from './sync.css';
import help from '../common/help.js';
const sync = function() {
    console.log('sync');
    
    fetch('/api/test')
    .then(response => response.json())
    .then(data => {
        console.log('fetch结果', data.message);
    })
    setTimeout(function() {
        document.getElementById('app').innerHTML = `<h1 class="${item.test}">hello Yideng Webpack</h1>`
    }, 2000)
    
}
const isArrayFun = function(args) {
    console.log(isArray(args));
}
export {
    sync,
    isArrayFun
}
```

#### 4. 单页 问题 多页转单页 webapp 性能 请求的数量 runtime

#### 5. 分析打包结果


跟CI绑定的一个包，没试过
```
npm install bundlesize --save-dev
```

在 package.json 中添加script,运行后会生成一个stats.json文件
```json
"chart": "webpack --mode development --profile --ison > stats.json",
```
但是有一点需要注意，把之前加优化界面的一些花里胡哨的东西都注释掉，
在github上找到webpack-chart
http://alexkuz.github.io/webpack-chart/
将stats.json放进去进行分析

或者在 http://webpack.github.io/analyse/ 也可以，只不过比较粗犷

#### 6. test exculde include 非常重要，每个loader都设置的话webpack会很快

#### 7. 压缩 JS CSS

用了这个就不用刚才的 terser-webpack-plugin了
这个包跟webpack自己的压缩相比较，项目小的时候webpack自己的压缩比较好用，项目大的时候再调用多核会好一些
```
npm install webpack-parallel-uglify-plugin --save-dev
```

webpack.production.js
```js

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const os = require('os');
module.exports = {
    output:{
        filename: 'script/[name].[hash:5].bundles.js',
        publicPath:'/'
    },
    plugins:[
        new ParallelUglifyPlugin({
            exclude: /\.min\.js$/,
            workerCount: os.cpus().length,
            /* uglifyJS: {

            }, */
            uglifyES: {
                output: {
                    beautify:false,
                    comments: false,
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true
                }
            }
        })
    ],
}
```

压缩css
```
npm install optimize-css-assets-webpack-plugin --save-dev
```
或者用nano

#### 8. devtool eval  sourcemap开启的选项
#### 9. cache-loader