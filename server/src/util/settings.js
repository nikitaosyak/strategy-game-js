'use strict'

module.exports.createSettings = () => {
    Logger.info('Settings: creating')
    const fs = require('fs')
    const path = require('path')
    const content = fs.readFileSync(path.join(process.cwd(), 'assets', 'settings.json'))
    module.exports.content = JSON.parse(content)

    Logger.info('Settings: loaded file content: ')
    Logger.info(module.exports.content)

    global.settings = module.exports.content

    return module.exports.content
}