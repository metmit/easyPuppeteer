try {
    let env = (process.env.NODE_ENV || 'online').toLowerCase();

    let file = require('path').resolve(__dirname, env);
    module.exports = require(file);
    console.log('Load config: [%s] %s', env, file);
} catch (err) {
    console.error('Cannot load config: [%s] %s', env, file);
    throw err;
}
