import {getUrlVars} from './util/http'
import {getRequest} from './util/http'

/**
 * @param {string} host
 * @param {number} port
 * @constructor
 */
export const ConnectionConstructor = (host, port) => {
    const _state = {
        host: host,
        port: port,
        address: host + ':' + port.toString(),
        online: false,
        token: "DEADBEEF"
    }

    return {
        get address() { return _state.address },
        get token() { return _state.token },
        isOnline: () => _state.online,
        /** @returns {Promise} */
        connect: () => {
            return new Promise((resolve, reject) => {
                // reject("connect: not implemented");
                const path =  getUrlVars(_state.address, 'hello')
                getRequest(path).then((data) => {
                    _state.token = data.token
                    _state.online = true
                    resolve()
                }, reject)
            })
        },
        /** @returns {Promise} */
        enqueue: () => {
            if (!_state.online) throw 'Connection.enqueue: offline'
            return new Promise((resolve, reject) => {
                const path = getUrlVars(
                    _state.address, 'queue', 
                    'user_token', _state.token)
                getRequest(path).then(resolve, reject)
            })
        },
        /**
         * @param {string} sessionToken
         * @returns {Promise}
         */
        ready: (sessionToken) => {
            if (!_state.online) throw 'Connection.ready: offline'
            getUrlVars(_state.address, 'session_player_ready', 'user_token', _state.token, 'session_token', sessionToken)
            return new Promise((resolve, reject) => {
                reject('ready for battle: not implemented')
            })
        },
        /**
         * @param {string} sessionToken
         * @param {number} turn
         * @returns {Promise}
         */
        turnHook: (sessionToken, turn) => {
            if (!_state.online) throw 'Connection.turnHook: offline'
            getUrlVars(_state.address, 'session_turn_hook',
                'user_token', _state.token, 'session_token', sessionToken, 'turn_number', turn)
            return new Promise((resolve, reject) => {
                reject('send turn hook: not implemented')
            })
        },
        /**
         * @param {string} sessionToken
         * @param {number} turn
         * @returns {Promise}
         */
        flushTurn: (sessionToken, turn) => {
            if (!_state.online) throw 'Connection.flushTurn: offline'
            getUrlVars(_state.address, 'session_flush_turn',
                'user_token', _state.token, 'session_token', sessionToken)
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
            if (!_state.online) throw 'Connection.flushTurn: offline'
            getUrlVars(_state.address, 'session_player_command', 'session_token', sessionToken)
            return new Promise((resolve, reject) => {
                reject('command: not implemented')
            })
        },

        traceState: () => {
            console.log(_state)
        }
    }
}