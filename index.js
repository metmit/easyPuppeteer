const Task = require('./app/task')

async function run(task) {

    if (!task || task.length <= 0) {
        return true
    }

    try {
        if (task instanceof "string") {
            task = JSON.parse(task)
        }
        return await Task.getInstance().run(task)
        //.catch(err => console.log(err))
    } catch (e) {
        return false;
    }
}

module.exports = {
    run: run
}


// (async () => {
//     await run('{"route":"baidu", "action":"index", "data":{"page":"1111"}}')
//         .catch(err => console.log(err))
// })()