
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

export const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest()
        req.addEventListener('error', reject)
        req.addEventListener('abort', reject)
        req.open('GET', url)
        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                const jsonData = JSON.parse(req.responseText)
                if (jsonData.status === 'OK') {
                    resolve(jsonData)
                } else {
                    throw 'http.getRequest failed: ' + req.responseText
                    reject()
                }
            }
        }
        req.send()
    })
}