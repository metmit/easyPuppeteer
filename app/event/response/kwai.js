
const Task = require('../../task')

const url_lib = require("url");

class Kwai {

    constructor(response) {
        this.response = response
        this.request = response.request()
        this.responseUrl = response.url()
        // this.responseData = response.text()
        // this.requestData = response.request().data()
    }

    async handle() {
        await this.save(result)
    }

    /**
     * 处理响应结果
     * @param result
     * @returns {Promise<boolean>}
     */
    async save(result) {
        if (!result.hasOwnProperty('primary')) {
            return false
        }

        let data = await this.response.text()

        console.log(data)
    }
}

module.exports = Response