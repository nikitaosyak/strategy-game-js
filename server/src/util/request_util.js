'use strict'

module.exports.send_ok_standard = (res) => {
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(JSON.stringify({status: 'OK'}))
}

module.exports.send_ok = (res, str_data) => {
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(str_data)
}

module.exports.send_fail_standard = (res) => {
    res.writeHead(400, {'Content-type': 'application/json'})
    res.end(JSON.stringify({status: 'FAILED'}))
}

module.exports.send_fail = (res, str_data) => {
    res.writeHead(400, {'Content-type': 'application/json'})
    res.end(str_data)
}

module.exports.standardRequestHandle = (response, task, errLog, answer = null) => {
    try {
        const taskResult = task()
        if (taskResult === true) {
            if (answer === null) {
                exports.send_ok_standard(response)
            } else {
                exports.send_ok(response, answer)
            }
        } else {
            Logger.error('StandardRequestHandle: SOFT_ERROR: [%s] %s ', taskResult,  errLog)
            exports.send_fail_standard('Soft error: ' + response)
        }
    } catch (e) {
        Logger.error('StandardRequestHandle: EXCEPTION: ' + errLog + "::" + e)
        exports.send_fail_standard('Exception: ' + response)
    }
}