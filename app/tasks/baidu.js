const Base = require('./base')

const Utils = require('../utils')

class Baidu extends Base {

    async _init() {
        let domain = '.baidu.com'
        if (domain.length > 0) {
            if (!this.browserInstance.hasCookie(domain)) {
                let cookieString = 'BD_UPN=123253; BAIDUID=B8DB086D22429FBC5E24EC35A28156A1:FG=1';
                if (cookieString) {
                    await this.browserInstance.addCookies(cookieString, domain)
                }
            }
        }
    }

    async run() {

        switch (this.task['action']) {
            case 'index':
                return await this.index()
            default:
                return false;
        }
    }

    async index() {

        let url = 'https://www.baidu.com/'

        try {
            await this.page.waitFor(1000)

            Utils.log('前往地址：' + url)
            await this.page.goto(url, {
                timeout: 40000,
                waitUntil: [
                    'load',              //等待 “load” 事件触发
                    'domcontentloaded', //等待 “domcontentloaded” 事件触发
                    // 'networkidle0',      //在 500ms 内没有任何网络连接
                    // 'networkidle2'       //在 500ms 内网络连接个数不超过 2 个
                ]
            });

            // 等待加载完成
            await this.page.waitFor(2 * 1000)
            Utils.log('加载完成：' + this.browserInstance.page.url())

            //页面滚动
            Utils.log('开始滚动')
            let scrollStep = 1000;
            for (let scrollNumber = 0; scrollNumber <= 3; scrollNumber++) {
                let scrollResult = await this.browserInstance.page.evaluate(function (top) {
                    window.scrollTo(0, top)
                    return 'top: ' + top
                }, scrollNumber * scrollStep)
                // Utils.log(scrollResult)
                await this.page.waitFor(1000)
            }
            Utils.log('滚动完成')

            await this.page.waitFor(2 * 1000)

        } catch (e) {
            Utils.log("抓取异常：" + e);
            return false
        } finally {
        }
        return true
    }
}

module.exports = Baidu