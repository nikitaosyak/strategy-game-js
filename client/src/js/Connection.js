
export class Connection {
    get host() { return this._host }
    get port() { return this._port }

    get isOnline() { return this._online }
    get token() { return this._token }

    constructor(host, port) {
        this._host = host
        this._port = port

        this._online = false
        this._token = ""
    }

    connect() {
        const url = 'http://' + this._host + ':' + this._port + '/hello'
        return new Promise((resolve, reject) => {
            reject("not implemented");
        })
    }

    enqueue() {
        if (!this._online) throw 'Connection.reqeustQueue: cannot queue while offline'

        const url = 'http://' + this._host + ':' + this._port + '/queue?user_token=' + this._token
        return new Promise((resolve, reject) => {
        })
    }
}