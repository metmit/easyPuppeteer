const Browser = require("./browser")
const Utils = require('./utils')
const Baidu = require('./tasks/baidu')
const Kwai = require('./tasks/kwai')

class Task {

    constructor() {
        this.browserInstance = null
        this.task = null
    }

    static getInstance() {
        if (!Task.instance) {
            Task.instance = new Task();
        }
        return Task.instance;
    }

    /**
     *
     * @param task 任务消息体
     * @param browserFlag 是否重置browser
     * @returns {Promise<boolean>}
     */
    async run(task, browserFlag = false) {

        this.task = task

        // 初始化浏览器
        await this.init(task)

        let instance = null;
        switch (task['route']) {
            case 'kwai':
                instance = new Kwai(this.browserInstance, task)
                break;
            case 'baidu':
                instance = new Baidu(this.browserInstance, task)
                break;
            default:
                instance = null;
        }

        if (!instance) {
            throw new Error('路由错误！')
        }

        // 初始化cookie
        await instance._init()
            //.catch(err=>console.log(err))
        await Utils.sleep(3 * 1000)

        // 执行任务
        let result = await instance.run()
            .catch(err=>console.log(err))

        if (!result) {
            await this.browserInstance.destructor()
            this.browserInstance = null
            await Utils.sleep(5 * 1000)
            return false
        }

        await Utils.sleep(2 * 1000)

        // 跳转空白页
        instance._blank()
        await this.page.waitFor(3 * 1000) // 3秒

        return true
    }

    /**
     * 初始化浏览器
     * @param task
     * @param browserFlag
     * @returns {Promise<void>}
     */
    async init(task, browserFlag) {

        if (browserFlag || !this.browserInstance) {
            console.log('初始化浏览器对象...')
            if (this.browserInstance) await this.browserInstance.destructor();
            this.browserInstance = null
            this.browserInstance = Browser.getInstance();
        }

        //browser
        await this.browserInstance.getBrowser()
        await Utils.sleep(2 * 1000)

        //pager
        await this.browserInstance.getPager()
        await Utils.sleep(2 * 1000)
        //event
        await this.browserInstance.bindEvent()
        await Utils.sleep(2 * 1000)
        //cookie
    }
}

module.exports = Task;