'use strict'

const http = require('http')

const settings = require('./util/settings').createSettings()
const game = require('./lobby/game').createGame();
const router = require('./router').createRouter(game)

const server = http.createServer((req, res) => router.route(req, res));
server.listen(settings.system.port, () => {
    console.info('CORE LOOP: server successfully run on ' + settings.system.port)
})
setInterval(game.update, settings.game.gameUpdateFrequency)