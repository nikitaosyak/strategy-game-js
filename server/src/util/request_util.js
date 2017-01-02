'use strict'

exports.send_ok_standard = (res) => {
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(JSON.stringify({status: 'OK'}))
}

exports.send_ok = (res, str_data) => {
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(str_data)
}

exports.send_fail_standard = (res) => {
    res.writeHead(400, {'Content-type': 'application/json'})
    res.end(JSON.stringify({status: 'FAILED'}))
}

exports.send_fail = (res, str_data) => {
    res.writeHead(400, {'Content-type': 'application/json'})
    res.end(str_data)
}

exports.standardRequestHandle = (response, task, errLog, answer = null) => {
    try {
        const success = task()
        if (success) {
            if (answer === null) {
                exports.send_ok_standard(response)
            } else {
                exports.send_ok(response, answer)
            }
        } else {
            console.log('SOFT_ERROR: ' + errLog)
            exports.send_fail_standard('Soft error: ' + response)
        }
    } catch (e) {
        console.log('EXCEPTION: ' + errLog + "::" + e)
        exports.send_fail_standard('Exception: ' + response)
    }
}