---
layout: post
title:  "爬虫"
categories: node 爬虫
tags: node 爬虫
date:   2019-08-20 17:41:54
author: ZXY
---

* content
{:toc}

### 爬虫系统以及Robots协议介绍
爬虫，是一中自动获取网页内容的程序。是搜索引擎的重要组成部分，因此搜索引擎优化很大程度上就是针对爬虫而做出优化。
robots.txt 是一个文本文件，robots.txt是一个协议，不是一个命令。robots.txt是爬虫要查看的第一个文件。robots.txt文件告诉爬虫在服务器上什么文件是可以被查看的，搜索机器人就会按照该文件中的内容来确定访问的范围。

### 配置爬虫系统和开发环境
直接使用express脚手架创建项目
安装 request 安装 cheerio
```
npm install request cheerio --save-dev
```

未完待续。。