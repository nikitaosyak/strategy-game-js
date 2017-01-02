'use strict'

module.exports.createSettings = () => {
    console.info('Settings: creating')
    const fs = require('fs')
    const path = require('path')
    const content = fs.readFileSync(path.join(process.cwd(), 'assets', 'settings.json'))
    module.exports.content = JSON.parse(content)

    console.info('Settings: loaded file content: ')
    console.info(module.exports.content)

    return module.exports.content
}