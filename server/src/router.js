'use strict'

module.exports.createRouter = (game) => {
    const http_dispatcher = require('httpdispatcher')
    const rand_token = require('rand-token')
    const url_parse = require('url-parse')

    const request = require('./util/request_util')

    const isWindows = /^win/.test(process.platform);
    const dispatcher = isWindows ? new http_dispatcher() : http_dispatcher

//
// client commands
//
// -------------
//
// standard operation for joining battle should be as follows:
// 1. hello to receive a user-token for further requests (also can perform user-operations after)
// 2. queue for battle
// 3. after successfull match, send session_player_ready to start turn countdown
// 4. right after, send session_turn_hook to be notified by server about turn end
// 5. send session_turn_hook and session_player_command after
// 6. send session_turn_flush to make turn end faster
// --------------

    dispatcher.onGet('/hello', (req, res) => {
        const userToken = rand_token.generate(8)

        request.standardRequestHandle(
            res,
            () => game.createUser(userToken),
            'unable to create user',
            JSON.stringify({status: 'OK', token: userToken})
        )
    })

    dispatcher.onGet('/queue', (req, res) => {
        const query = url_parse(req.url, true).query
        const success = game.queueUser(query.user_token, res);

        if (!success) {
            request.send_fail_standard(res)
        }
    })

    dispatcher.onGet('/session_player_ready', (req, res) => {
        const query = url_parse(req.url, true).query

        request.standardRequestHandle(
            res,
            () => game.getSession(query.session_token).userReady(query.user_token),
            'unable to set session ready'
        )
    })

    dispatcher.onGet('/session_turn_hook', (req, res) => {
        const query = url_parse(req.url, true).query

        try {
            const success = game.getSession(query.session_token)
                .storeHook(
                    query.user_token,
                    query.turn_number,
                    res
                )
            if (!success) {
                console.log('Error: cannot set turn hook for %s on turn %d',
                    query.user_token, query.turn_number)
                request.send_fail_standard(res)
            }
        }
        catch(e) {
            console.log('Exception: cannot set turn hook: %s', e)
            request.send_fail_standard(res)
        }
    })

    dispatcher.onPost('/session_player_command', (req, res) => {
        const query = url_parse(req.url, true).query

        request.standardRequestHandle(
            res,
            () => game.getSession(query.session_token).storeCommands(req.body),
            'unable to store player command'
        )
    })

    dispatcher.onGet('/session_flush_turn', (req, res) => {
        const query = url_parse(req.url, true).query

        request.standardRequestHandle(
            res,
            () => game.getSession(query.session_token).flushTurn(query.user_token),
            'unable to flush turn'
        )
    })

    dispatcher.onGet('/keep_alive', (req, res) => {
        const query = url_parse(req.url, true).query

        request.standardRequestHandle(
            res,
            () => game.getUser(query.token).keepAlive(),
            'unable to keep player alive'
        )
    })

//
// :3
    dispatcher.onError((req, res) => {
        res.writeHead(404, {'Content-type': 'application/json'})
        res.end(JSON.stringify({message: 'invalid url'}))
    })

    return {
        route: (request, response) => dispatcher.dispatch(request, response)
    }
}