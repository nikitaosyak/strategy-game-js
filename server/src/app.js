'use strict'

module.exports.RunApp = (testingPort) => {
    global.Logger = require('js-logger')
    Logger.useDefaults()

    const env = process.env.NODE_ENV
    switch(env) {
        case 'TEST':
            Logger.setLevel(Logger.ERROR)
            break
        case 'DEVELOPMENT':
            Logger.setLevel(Logger.INFO)
            break
        case 'RELEASE':
            Logger.setLevel(Logger.OFF)
            break
        default:
            console.warn('Unknown node.env: %s. logger is ON', env)
    }

    const http = require('http')

    const settings = require('./util/settings').createSettings()
    const game = require('./lobby/game').createGame();
    const router = require('./router').createRouter(game)

    const server = http.createServer((req, res) => router.route(req, res));
    server.listen(env == 'TEST' ? testingPort : settings.system.port, () => {
        Logger.info('server successfully run on ', settings.system.port)
    })
    setInterval(game.update, settings.game.gameUpdateFrequency)
}

if(require.main === module) {
    module.exports.RunApp()
}