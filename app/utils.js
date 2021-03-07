class Utils {
    /**
     * 延迟
     * @param {number} time 延迟的时间,单位毫秒
     */
    static sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(1)
                } catch (e) {
                    reject(0)
                }
            }, time);
        })
    };

    static log(message = '') {
        console.log(message)
    }
}

module.exports = Utils;