module.exports = {
  title: "zxy的前端日志",
  description: "大前端之路开启",
  ga: "UA-121061441-1",
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/react.png' }]
  ],
  themeConfig: {
    repo: "zxy/blog",
    nav: [
      {
        text: "博客",
        link: "/blog/"
      },
      {
        text: "面试题",
        link: "/interview/"
      },
      {
        text: "阅读",
        link: "/book/"
      },
    ],
    sidebar: {
      "/blog/": [
        {
          title: 'Framework(大佬写的)',
          collapsable: false,
          children: [
            "library-node",
            "library-react",
            "libary-react-core",
            "library-react-code-1",
            "library-react-code-2",
            "library-react-code-3",
            "library-react-ssr",
            'library-react-hooks',
            "library-vue",
            "library-miniProgram",
            "library-redux",
            "library-rxjs",
            "libary-koa",
          ]
        },
        {
          title: 'PHP',
          collapsable: false,
          children: [
            "2019-05-28-php",
            "2019-06-05-php&mysql",
            "2019-06-05-php_OOP_introduction",
            "2019-06-05-PHP_construct",
            "2019-06-10-OOP_fengzhuang",
            "2019-06-10-OOP_jicheng_duotai",
            "2019-06-10-OOP_interface_abstract",
            "2019-06-11-OPP_error",
          ]
        },
        {
          title: 'node',
          collapsable: false,
          children: [
            "2019-06-25-node",
            "2019-06-26-express1",
            "2019-06-27-express-middleware",
            "2019-06-27-express-router",
            "2019-06-27-express-error",
            "2019-08-19-node",
            "2019-08-20-express",
            "2019-08-20-node-pachong"
          ]
        },
        {
          title: '工程化',
          collapsable: false,
          children: [
            "2019-06-27-qa",
            "2019-08-04-QA",
            "2019-07-05-webpack1",
            "2019-07-05-webpack2",
            "2019-07-09-webpack3",
            "2019-07-10-webpack4",
            "webpack-0-1",
          ]
        },
        {
          title: 'js基础',
          collapsable: false,
          children: [
            "",
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "2019-07-31-fp-",
          ]
        },
        {
          title: 'Linux',
          collapsable: false,
          children: [
            "2019-05-27-Linux-instructions",
            "2019-07-31-linux",
          ]
        },
        {
          title: '网络协议',
          collapsable: false,
          children: [
            "2019-08-14-http1",
            "2019-08-15-http2",
          ]
        },
      ],
      "/interview/": [
        {
          title: '前端',
          collapsable: false,
          children: [
            "js",
            "css",
            "html",
            "framework"
          ]
        },
        {
          title: '笔试题',
          collapsable: false,
          children: [
            "2019-07-16-100questions",
            "2019-07-21-yidengquestions",
            "2019-07-21-yidengquestions2", 
            "2019-07-21-yidengquestions3", 
            "2019-08-06-yidengquestion"
          ]
        },
        {
          title: '编程基础',
          collapsable: false,
          children: [
            "base",
            "suanfa"
          ]
        },
      ],
      "/book/": [
        {
          title: '技术相关',
          collapsable: false,
          children: [
            "book-nodejs",
            "book-microfront",
            "book-webgl",
            "book-maintainable-js",
            "book-how-network-connect",
            "book-regular",
            "book-code",
            "book-http2",
            "book-http-graph"
          ]
        },
      ],
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址"
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: 'img',
      options: {
          margin: 16
      }
    },
    '@vuepress/back-to-top':true
  }
};
