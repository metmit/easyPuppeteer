const Utils = require('../utils')

class Base {

    constructor(browser, task) {
        this.task = task
        this.browserInstance = browser;
        this.page = this.browserInstance.page
    }

    async run() {
    }

    async _init() {
    }

    async _blank() {
        Utils.log('前往空白页')
        await this.page.goto('about:blank', {
            timeout: 40000,
        });
    }
}

module.exports = Base
