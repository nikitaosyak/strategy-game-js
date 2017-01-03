
const randToken = require('rand-token')
const http = require('http')

const testPort = 9090

module.exports.port = testPort
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