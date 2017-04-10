
export const getUrlVars = (address, path, ...args) => {
    if (args.length % 2 !== 0) throw 'http.getUrlVars: invalid parameters, should be in pairs'

    let result
    if (args.length === 0) {
        result = 'http://' + address + '/' + path
    } else {
        result = 'http://' + address + '/' + path + '?'
        for (let i = 0; i < args.length; i+=2) {
            if (i > 0) result += '&'
            result += args[i] + '=' + args[i+1]
        }
    }

    console.log('http.getUrlVars: ' + result)

    return result
}

export const getRequest = (url, timeout = 2000) => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.timeout = timeout
        req.addEventListener('error', reject)
        req.addEventListener('abort', reject)
        req.open('GET', url, true)
        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                const jsonData = JSON.parse(req.responseText)
                if (jsonData.status === 'OK') {
                    resolve(jsonData)
                } else {
                    reject('http.getRequest failed: ' + req.responseText)
                }
            }
        }
        req.send()
    })
}

export const postRequest = (url, strData) => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.addEventListener('error', reject)
        req.addEventListener('abort', reject)
        req.open('POST', url, true)

        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                const jsonData = JSON.parse(req.responseText)
                if (jsonData.status === 'OK') {
                    resolve(jsonData)
                } else {
                    reject('http.getRequest failed: ' + req.responseText)
                }
            }
        }
        req.send(strData)
    })
}