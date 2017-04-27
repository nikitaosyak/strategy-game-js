import {getUrlVars} from './util/http'
import {getRequest} from './util/http'
import {postRequest} from './util/http'

/**
 * @param {string} host
 * @param {number} port
 * @constructor
 */
export const ConnectionConstructor = (host, port) => {

    const address = host + ':' + port.toString()
    let online = false
    let token = "DEADBEEF"

    return {
        get address() { return address },
        get token() { return token },
        get isOnline() { return online },
        /** @returns {Promise} */
        connect: () => {
            return new Promise((resolve, reject) => {
                const path =  getUrlVars(address, 'hello')
                getRequest(path).then((data) => {
                    token = data.token
                    online = true
                    resolve()
                },
                () => {
                    resolve()
                })
            })
        },
        /** @returns {Promise} */
        enqueue: () => {
            if (online) {
                return new Promise((resolve, reject) => {
                    const path = getUrlVars(address, 'queue', 'user_token', token)
                    getRequest(path).then(resolve, reject)
                })
            } else {
                return new Promise((resolve, _) => resolve({session_token:'DEADBEEF', users:['MOCKUP']}))
            }
        },
        /**
         * @param {string} sessionToken
         * @returns {Promise}
         */
        ready: (sessionToken) => {
            if (online) {
                const path = getUrlVars(_state.address,
                    'session_player_ready',
                    'user_token', token,
                    'session_token', sessionToken)

                return new Promise((resolve, reject) => {
                    getRequest(path).then(resolve, reject)
                })
            } else {
                return new Promise((resolve, _) => {
                    resolve()
                })
            }
        },
        /**
         * @param {string} sessionToken
         * @param {number} turn
         * @returns {Promise}
         */
        turnHook: (sessionToken, turn) => {
            if (online) {
                const path = getUrlVars(address, 'session_turn_hook',
                    'user_token', token, 'session_token', sessionToken, 'turn_number', turn)
                return new Promise((resolve, reject) => {
                    getRequest(path, 30000).then((response) => resolve(response.commands), reject)
                })
            } else {
                // offline emulation
                return new Promise((resolve, _) => {
                    setTimeout(resolve, 1000, [])
                })
            }
        },
        /**
         * @param {string} sessionToken
         * @param {number} turn
         * @returns {Promise}
         */
        flushTurn: (sessionToken, turn) => {
            if (!online) throw 'Connection.flushTurn: offline'
            getUrlVars(address, 'session_flush_turn',
                'user_token', token, 'session_token', sessionToken)
            return new Promise((resolve, reject) => {
                reject('flush turn: not implemented')
            })
        },
        /**
         * @param {string} sessionToken
         * @param {object} value
         * @returns {Promise}
         */
        command: (sessionToken, value) => {
            if (online) {
                const path = getUrlVars(address, 'session_player_command', 'session_token', sessionToken)
                return new Promise((resolve, reject) => {
                    postRequest(path, value).then(resolve, reject)
                })
            } else {
                return new Promise((resolve, _) => resolve())
            }
        },

        traceState: () => {
            console.log("Connection: host: %s, port: %s, online: %s, token: %s", host, port, online, token)
        }
    }
}