const testPort = 9090

let app = null
let appState = null
module.exports.run = () => {
    app = require('../../src/app')
    appState = app.runApp(testPort, 10)
    appState.settings.lobby.userStaleTime = 20

    module.exports.app = app
    module.exports.appState = appState
}

module.exports.stop = () => {
    app.closeServer(appState.server)
    app = null
    appState = null
}


const randToken = require('rand-token')
const http = require('http')


module.exports.assert = require('assert')
module.exports.randomSequence = (length) => randToken.generate(length)

module.exports.getRequest = (path, onResponse) => {
    const r = http.request(
        {
            hostname: 'localhost',
            port: testPort,
            path: '/' + path,
            method: 'get'
        },

        (response) => {
            let body = ''
            response.on('data', (d) => body += d)
            response.on('end', () => {
                const received = JSON.parse(body)
                onResponse(received)
            })
        }
    )
    r.end()
}