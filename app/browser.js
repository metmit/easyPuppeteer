const puppeteer = require("puppeteer");

class Browser {

    constructor() {
        this.url = '';
        this.browser = null;
        this.page = null;
        this.boundEvent = false
        this.cookies = {}
    }

    static getInstance() {
        if (!Browser.instance) {
            Browser.instance = new Browser();
        }
        return Browser.instance;
    }

    /**
     * 清理所有
     * @returns {Promise<void>}
     */
    async destructor() {
        await this.clearBrowser()
        Browser.instance = null
    }

    /**
     * 获取浏览器对象
     * @returns {Promise<null>}
     */
    async getBrowser() {
        if (this.browser /*&& Puppeteer.Browser*/) {
            return this.browser
        }

        //先自行清理一遍
        await this.clearBrowser()

        try {
            let param = [
                '--no-sandbox', '--disable-setuid-sandbox', // linux环境一定不能省略这俩个参数
                '--start-fullscreen', // 全屏打开页面
            ];
            let options = {
                headless: true, // 隐藏窗口
                // headless: false, // 显示窗口
                timeout: 10000,
                slowMo: 100,    //放慢速度
                // defaultViewport: {width: 1920, height: 800}, //设置可视区域大小
                defaultViewport: null, //自适应页面大小
                ignoreHTTPSErrors: false, //忽略 https 报错
                args: param
            }

            // 启动浏览器
            this.log('浏览器启动参数：' + JSON.stringify(options))
            this.browser = await puppeteer.launch(options);

            return this.browser
        } catch (e) {
            this.log("初始化浏览器异常：" + e.message());
            await this.clearBrowser()
            throw e
        } finally {
        }
    }

    /**
     * 启动pager
     * @return {!Promise<!Puppeteer.Page>}
     */
    async getPager() {

        if (this.page /*&& Puppeteer.Page*/) {
            return this.page
        }

        //先自行清理一遍
        await this.clearPager()

        try {
            //打开新页面
            this.log('创建新页面')
            this.page = await this.browser.newPage();

            //关闭空白tab页面
            this.log('关闭空白tab页')
            let ps = await this.browser.pages()
            await ps[0].close()

            this.log('Pager启动完成，准备跳页面')
            // await Utils.sleep(10 * 1000)

            return this.page
        } catch (e) {
            this.log("初始化 [Pager] 异常：" + e);
            await this.clearPager()
            throw e
        }
    }

    async bindEvent() {

        if (this.boundEvent !== false) return true;

        this.boundEvent = true

        this.log('绑定 request 事件')
        let Request = require('./event/request')
        await this.page.setRequestInterception(true);
        await this.page.on('request', async request => {
            let cls = new Request(request)
            await cls.handle()
        });

        this.log('绑定 response 事件')
        let Response = require('./event/response')
        await this.page.on('response', async (response) => {
            let cls = new Response(response)
            await cls.handle()
        });
    }

    hasCookie(domain) {
        return this.cookies && this.cookies.hasOwnProperty(domain);
    }

    async addCookies(cookies_str, domain) {
        //删除
        await this.deleteCookies(domain)

        //添加
        let page = this.page
        let cookies = cookies_str.split(';').map(
            pair => {
                let name = pair.trim().slice(0, pair.trim().indexOf('='));
                let value = pair.trim().slice(pair.trim().indexOf('=') + 1);
                return {name, value, domain}
            });
        await Promise.all(cookies.map(pair => {
            return page.setCookie(pair)
        }))

        //设置
        this.cookies[domain] = cookies_str
    }

    async getCookies(url = null) {
        await this.page.cookies(url)
        // page.cookies([...urls])v0.9.0
        // ...urls <...string>
        // 如果不指定任何 url，此方法返回当前页面域名的 cookie。 如果指定了 url，只返回指定的 url 下的 cookie。
    }

    async clearBrowser() {
        try {
            await this.clearPager()
            if (this.browser) await this.browser.close();
        } catch (err) {
            this.log("清理 [browser] 失败：" + err);
        } finally {
            this.browser = null;
        }
    }

    async clearPager() {
        try {
            await this.clearCookies()
            await this.clearEvent()
            if (this.page) await this.page.close();
        } catch (err) {
            this.log("清理 [pager] 失败：" + err);
        } finally {
            this.page = null;
        }
    }

    async clearEvent() {
        try {
            if (this.page) await this.page.removeAllListeners();
        } catch (err) {
            this.log("清理 [event] 失败：" + err);
        } finally {
            this.boundEvent = false
        }
    }

    async clearCookies() {
        try {
            for (let domain in this.cookies) {
                await this.deleteCookies(domain)
            }
        } catch (err) {
            this.log("清理 [cookie] 失败：" + err);
        } finally {
            this.cookies = {}
        }
    }

    async deleteCookies(domain) {

        if (!this.hasCookie(domain)) return false;

        let page = this.page
        let cookies = this.cookies[domain].split(';').map(
            pair => {
                let name = pair.trim().slice(0, pair.trim().indexOf('='));
                // let url = domain
                return {'name': name, 'domain': domain}
                // return {name, domain}
            });

        for (const cookie of cookies) {
            await page.deleteCookie(cookie)
        }

        this.cookies[domain] = null
        delete this.cookies[domain]
    }

    // 打印日志
    log(message) {
        console.log(message)
    }

    //*******************//
    async click(selector) {
        await this.page.click(selector).catch(err => console.log(err))
    }

}

module.exports = Browser
