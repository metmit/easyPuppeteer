
const Task = require('../task')

class Response {

    constructor(response) {
        this.response = response
        this.request = response.request()

        this.responseUrl = response.url()
        // this.responseData = response.text()

        // this.requestData = response.request().data()
    }

    async handle() {

        let result = {}

        let clz = ''
        switch (Task.getInstance().task['route']) {
            case "baidu":
                result = this.baidu()
                break;
            case 'kwai':
                clz = require('./response/kwai')
                let instance = new clz(this.response)
                break;
        }

        await this.save(result)
    }

    /**
     * 处理响应结果
     * @param result
     * @returns {Promise<boolean>}
     */
    async save(result) {
        // 结果是否有唯一标识
        if (!result.hasOwnProperty('primary')) {
            return false
        }

        let data = await this.response.text()

        if (Task.getInstance().task['platform'] === 'baidu') {
            console.log(data)
        }
    }

    /**
     * 百度
     * @returns {{}}
     */
    baidu() {
        let result = {}
        if (this.responseUrl === 'https://www.baidu.com/') {
            result['primary'] = "index_0"
        }
        return result
    }
}

module.exports = Response