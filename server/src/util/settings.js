'use strict'

module.exports.createSettings = () => {
    console.info('Settings: creating')
    const fs = require('fs')
    const content = fs.readFileSync('./settings.json')
    module.exports.content = JSON.parse(content)

    console.info('Settings: loaded file content: ')
    console.info(module.exports.content)

    return module.exports.content
}