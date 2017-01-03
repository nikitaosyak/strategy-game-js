'use strict'

module.exports.runApp = (testingPort, testingFrequency) => {
    global.Logger = require('js-logger')
    Logger.useDefaults()

    global.ENV = process.env.NODE_ENV
    switch(ENV) {
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
            console.warn('Unknown node.env: %s. logger is ON', ENV)
    }

    const http = require('http')

    const settings = require('./util/settings').createSettings()
    const game = require('./lobby/game').createGame();
    const router = require('./router').createRouter(game)

    const server = http.createServer((req, res) => router.route(req, res));
    server.listen(ENV == 'TEST' ? testingPort : settings.system.port, () => {
        Logger.info('server successfully run on ', settings.system.port)
    })
    setInterval(game.update, ENV == 'TEST' ? testingFrequency : settings.game.gameUpdateFrequency)

    if (ENV == 'TEST') {
        return {
            settings: settings,
            game: game,
            router: router,
            server: server
        }
    }
}

module.exports.closeServer = (server) => {
    server.close()
}

if(require.main === module) {
    module.exports.run()
}