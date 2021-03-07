'use strict'

const Task = require('../task')

class Request {

    constructor(request) {
        this.request = request
    }

    async handle() {
        let platform = Task.getInstance().task['route']
        switch (platform) {
            case 'baidu':
                return this.baidu()
            default:
                return this.dft()
        }
    }

    dft() {
        // script, xhr, other, document, image, stylesheet
        if (1 === 0 /*|| request.resourceType() === 'image'*/) {
            this.request.abort();
        } else {
            this.request.continue();
        }
    }

    baidu() {
        // script, xhr, other, document, image, stylesheet
        if (1 === 0 || this.request.resourceType() === 'stylesheet') { // 拒绝请求css样式表
            console.log('baidu: ' + this.request.resourceType())
            this.request.abort();
        } else {
            this.request.continue();
        }
    }
}


module.exports = Request