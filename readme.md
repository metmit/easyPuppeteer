# puppeteer

## 介绍

puppeteer 是谷歌退出的针对Chrome Headless特性，通过JS调用Chrome DevTools开放的接口与Chrome通信，puppeteer对复杂的Chrome DevTools接口进行了更易用的封装。

在爬虫、测试自动化等方面使用非常方便，作为无头浏览器，是真正运行的无界面渲染的浏览器，可以使程序如真人操作一样执行。

## 使用
```
$ npm install
```

## 测试

打开百度首页，并截图。
```js
(async () => {
    await require('./index').run('{"route":"baidu", "action":"index", "data":{"page":"1111"}}')
        .catch(err => console.log(err))
})()
```

## 参考
- https://github.com/puppeteer/puppeteer
- https://www.kancloud.cn/luponu/puppeteer/870133
- https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-getCookies

