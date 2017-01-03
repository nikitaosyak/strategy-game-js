'use strict'

module.exports.createGame = () => {
    const mod_token = require('rand-token')
    const request = require('../util/request_util')
    const user = require('./user')
    const session = require('../session/session')

    const _users = new Map();
    const _sessions = new Map();

    const _waitingQueue = [];

    const self = {
        getUser: (token) => _users.get(token),
        getSession: (token) => _sessions.get(token),

        //
        // main update loop
        update: () => {
            _users.forEach((user, key, map) => {

                //
                // kick expired users
                if (user.isStale()) {
                    map.delete(key)
                    Logger.log('Game.update: user %s is expired. current users: %d', user.getToken(), map.size)

                    _waitingQueue.forEach((item, index) => {
                        if (user.getToken() === user.getToken()) {
                            Logger.log('    user also removed from queue')
                            _waitingQueue.splice(index, 1)
                        }
                    })
                }
            })

            //
            // create sessions:
            if (_waitingQueue.length >= 2) {
                // pick two random indexes and grab they queue items
                let randomIdx = Math.floor(Math.random() * _waitingQueue.length)
                const user1Item = _waitingQueue.splice(randomIdx, 1)[0]

                randomIdx = Math.floor(Math.random() * _waitingQueue.length)
                const user2Item = _waitingQueue.splice(randomIdx, 1)[0]

                Logger.log('Game.createSession: selected users %s and %s',
                    user1Item.user.getToken(), user2Item.user.getToken())

                //
                // generate new Session object and notify users about it
                const sessionToken = mod_token.generate(8)
                const session = session.createSession(sessionToken, user1Item.user, user2Item.user)
                _sessions.set(sessionToken, session)

                const responseObj = JSON.stringify({
                    status: 'OK',
                    session_token: sessionToken,
                    users: [user1Item.user.getToken(), user2Item.user.getToken()]
                })
                request.send_ok(user1Item.response, responseObj)
                request.send_ok(user2Item.response, responseObj)
            }

            //
            // update session's game logic
            _sessions.forEach((session, key, map) => {
                if (session.isDone()) {
                    map.delete(key)
                    return
                }
                session.update()
            })
        },

        //
        // utility
        createUser: (token) => {
            if (_users.has(token)) {
                Logger.warn('Game.createUser: map already contains user %s', token)
                return false
            }
            _users.set(token, user.createUser(token))
            Logger.log('Game.create: new user %s. current users: %d', token, _users.size)
            return true
        },

        queueUser: (token, responseHook) => {
            const user = self.getUser(token)
            if (user === undefined || user === null) {
                Logger.warn('Game.queue: user %s does not exists', token)
                return false
            }
            user.keepAlive()

            let containsUser = false
            _waitingQueue.forEach(item => {
                if (item.user.getToken() == token) {
                    containsUser = true
                }
            })
            if (containsUser) {
                Logger.warn('Game.queue: user %s already queued', token)
                return false
            }
            _waitingQueue.push({user: user, response: responseHook});
            Logger.log('Game.queue: user %s added. queue len: %d', token, _waitingQueue.length)
            return true
        }
    }

    if (ENV == 'TEST') {
        self._users = _users
        self._sessions = _sessions
        self._waitingQueue = _waitingQueue
    }
    return self;
}