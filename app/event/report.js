
class Report {

    constructor(task) {
        this.task = task
    }

    async handle() {

        let result = {}

        switch (this.task['route']) {
            case "baidu":
                result = await this.baidu()
                break
        }
    }

    /**
     * 百度
     * @returns {{}|{type: string, primary: *}}
     */
    async baidu() {
        switch (this.task['action']) {
            case 'index':
                return this.baidu();
        }

        return {}
    }
}

module.exports = Report