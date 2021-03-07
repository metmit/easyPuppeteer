const Base = require('./base')

const Utils = require('../utils')

class Baidu extends Base {

    async _init() {
        let domain = '.kuaishou.com'
        if (!this.browserInstance.hasCookie(domain)) {
            let cookieString = 'clientid=3; client_key=65890b29; sid=4dba2912bdaa87406d70fd99';
            if (cookieString) {
                await this.browserInstance.addCookies(cookieString, domain)
            }
        }
    }

    async run() {
        switch (this.task['action']) {
            case 'user_info':
                return await this.user_info()
            default:
                return false;
        }
    }

    /**
     * 首页
     * @return {Promise<boolean>}
     */
    async index() {
        try {
            await this.page.waitFor(1000)
            let url = 'https://live.kuaishou.com/'
            Utils.log('前往地址：' + url)
            await this.page.goto(url, {
                timeout: 40000,
                waitUntil: ['load', 'domcontentloaded']
            });
            // 等待加载完成
            await this.page.waitFor(3 * 1000)
            Utils.log('加载完成：' + this.page.url())

            //直播大屏
            Utils.log('点击 - 直播大屏-01')
            await this.browserInstance.click('#app > div:nth-child(1) > div.main-container > div.hot-live > div.hot-live-container > ul > li:nth-child(1)')
                .catch(err => console.log('fail'))
            await this.page.waitFor(5 * 1000)

            //直播大屏
            Utils.log('点击 - 直播大屏-02')
            await this.browserInstance.click('#app > div:nth-child(1) > div.main-container > div.hot-live > div.hot-live-container > ul > li:nth-child(2)')
                .catch(err => console.log('fail'))
            await this.page.waitFor(3 * 1000)

            //页面滚动
            Utils.log('开始滚动')
            let scrollStep = 600;
            for (let scrollNumber = 0; scrollNumber <= 3; scrollNumber++) {
                let scrollResult = await this.browserInstance.page.evaluate(function (top) {
                    window.scrollTo(0, top)
                    return 'top: ' + top
                }, scrollNumber * scrollStep)
                // Utils.log(scrollResult)
                await this.page.waitFor(1000)
            }
            Utils.log('滚动完成')

            await this.page.waitFor(3 * 1000)

        } catch (e) {
            Utils.log("抓取异常：" + e);
            return false
        } finally {
        }
        return true
    }

    /**
     * 用户信息
     * @return {Promise<boolean>}
     */
    async user_info() {
        // await this.index()
        try {
            let url = 'https://live.kuaishou.com/profile/' + this.task['data']['eid']
            await this.page.waitFor(1000)
            await this.page.goto(url, {
                waitUntil: ['load', 'domcontentloaded'],
                referer: 'https://live.kuaishou.com/'
            });

            // 等待加载完成
            await this.page.waitFor(2 * 1000)
            Utils.log('加载完成：' + this.page.url())

            Utils.log('点击 - 登录的关闭窗口')
            await this.browserInstance.click('body > div.user-modal > div > a')
                .catch(err => console.log('fail'))
            await this.page.waitFor(3 * 1000)

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

            await this.page.waitFor(3 * 1000)

        } catch (e) {
            Utils.log("抓取异常：" + e);
            return false
        } finally {
        }
        return true
    }
}

module.exports = Baidu