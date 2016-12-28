'use strict'

var isWin = /^win/.test(process.platform);

//
// import
//

const   util = require('util'),
        url_parse = require('url-parse'),
        mod_http = require('http'),
        mod_token = require('rand-token'),
        mod_dispatcher = require('httpdispatcher'),
        dispatcher = isWin ? new mod_dispatcher() : mod_dispatcher;

const request = require('./request_util');

//
// game part
//

const Player = (_user) => {
    console.log('Player: created for user %s', _user.getToken())
    let _turnHook = null
    let _turnFlushed = false

    return {
        getUser: () => _user,
        getTurnFlushed: () => _turnFlushed,
        getTurnHook: () => _turnHook,

        flushTurn: () => _turnFlushed = true,
        setTurnHook: (response) =>  {
            if (_turnHook !== null) {
                console.log('Player:setTurnHook: turn hook already exists!')
                return false
            }

            _turnHook = response
            return true
        },

        resetTurnState: () => {
            _turnHook = null
            _turnFlushed = false
        }
    }
}

const Session = (_token, user1, user2) => {
    const State = {
        WAITING_USERS: 'waiting_users',
        TURN_IN_PROGRESS: 'turn_in_progress',
        BETWEEN_TURN_PAUSE: 'between_turn_pause',
        SESSION_ENDED: 'session_ended'
    }

    const _users = [user1, user2]
    const _players = []

    const TURN_TIME = 10
    const TURN_PAUSE_TIME = 0.1
    let _turn = 0
    let _turnCommands = []


    let _countStarted = 0

    let _state = State.WAITING_USERS

    //
    // inner play logic
    const _startTurn = () => {
        _countStarted = Date.now()
        _state = State.TURN_IN_PROGRESS
        console.log('Session: new turn #%d', _turn)
    }

    const _endTurn = () => {
        const turnCommandsStr = JSON.stringify({status: 'OK', commands: _turnCommands})
        _turnCommands = []
        // console.log('Session: will send commands: %s', turnCommandsStr)
        _players.forEach((p, i) => {
            if (_state == State.SESSION_ENDED) return

            if (p.getUser().isStale()) {
                console.log('Session:endTurn: user %d is stale!', i)
                _endSession()
                return
            }
            
            const hook = p.getTurnHook()
            if (hook === null) {
                console.log(p.getUser().getToken() + ': Hook not set!')
                _endSession()
                return
            } 
            request.send_ok(hook, turnCommandsStr)
            p.resetTurnState()
        })

        _state = State.BETWEEN_TURN_PAUSE
        _countStarted = Date.now()
        console.log('Session: end of turn #%d', _turn)

        _turn += 1
    }

    const _endSession = () => {
        // todo: this shit requires proper destruction
        _state = State.SESSION_ENDED
    }

    //
    // public methods
    const self = {
        isDone: () => State == State.SESSION_ENDED,
        getToken: () => _token,
        getUsers: () => _users,
        getPlayer: (userToken) => {
            for (let i = 0; i < _players.length; i++) {
                const user = _players[i].getUser()
                if (user.getToken() == userToken) return _players[i]
            }
            return null
        },

        //
        // user commands
        userReady: (userToken) => {
            let success = false
            _users.forEach(user => {
                if (user.getToken() == userToken) {
                    console.log('Session:userReady: approving player %s', user.getToken())
                    _players.push(Player(user))
                    success = true
                }
            })

            if (_players.length == _users.length) {
                console.log('Session:userReady: all users are ready! match starting!')
                _startTurn()
            }
            return success
        },

        storeHook: (userToken, turnNumber, response) => {
            if (turnNumber != _turn) return false
            const p = self.getPlayer(userToken)
            if (p === null) {
                _endSession()
                return false
            }


            if (p.setTurnHook(response)) {
                return true
            }
            _endSession()
            return false
        },

        storeCommands: (value) => {
            let success = true
            var commandList = JSON.parse(value)
            commandList.forEach(cmd => {
                if (cmd.turn == _turn) {
                    console.log('player %s commands: %s', cmd.user_token, cmd.command)
                    _turnCommands.push(cmd)
                } else {
                    success = false
                }
            })
            return success
        },

        flushTurn: (userToken, turnNumber) => {
            if (turnNumber != _turn) return false
            const p = getPlayer(userToken)
            if (p === null) return false
            p.flushTurn()
        },

        //
        // update
        update: () => {
            if (_state == State.SESSION_ENDED) return

            const elapsed = (Date.now() - _countStarted) / 1000
            // console.log('turn time: %i. turn state: %s', elapsed, _state)

            if (_state == State.TURN_IN_PROGRESS) {
                if (elapsed >= TURN_TIME) { // turn ended due to timeout
                    _endTurn()
                } else {                     // turn ended due to players flush
                    let flushes = 0 
                    for (var i = 0; i < _players.length; i++) {
                        if (_players[i].getTurnFlushed()) {
                            flushes += 1
                        }
                    }
                    if (flushes == _players.length) {
                        _endTurn()
                    }
                }
            }

            if (_state == State.BETWEEN_TURN_PAUSE && elapsed >= TURN_PAUSE_TIME) {
                _startTurn()
            }
        }
    }

    return self
}

const User = (_token) => {
    let _stale = false
    let _lastUpdateTime = Date.now()
    
    return {
        //
        // values to have
        getToken: () => _token,
        
        //
        // expiration logic block
        getStaleSeconds: () => (Date.now() - _lastUpdateTime) / 1000,
        keepAlive: () => {
            if (_stale) return false
            _lastUpdateTime = Date.now()
            return true
        },
        setStale: () => _stale = true,
        isStale: () => _stale === true,

        //
        //
    }
}

const Game = () => {
    const USER_STALE_TIME = 60;
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
                if (user.getStaleSeconds() >= USER_STALE_TIME) {
                    user.setStale()
                    map.delete(key)
                    console.log('Game.update: user %s is expired. current users: %d', 
                        user.getToken(), map.size)

                    _waitingQueue.forEach((item, index) => {
                        if (user.getToken() === user.getToken()) {
                            console.log('    user also removed from queue')
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

                console.log('Game.createSession: selected users %s and %s', 
                    user1Item.user.getToken(), user2Item.user.getToken())

                //
                // generate new Session object and notify users about it
                const sessionToken = mod_token.generate(8)
                const session = Session(sessionToken, user1Item.user, user2Item.user)
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
                console.log('Game.createUser: map already contains user %s', token)
                return false
            }
            _users.set(token, User(token))
            console.log('Game.create: new user %s. current users: %d', token, _users.size)
            return true
        },

        queueUser: (token, responseHook) => {
            const user = self.getUser(token)
            if (user === undefined || user === null) {
                console.log('Game.queue: user %s does not exists', token)
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
                console.log('Game.queue: user %s already queued', token)
                return false
            }
            _waitingQueue.push({user: user, response: responseHook});
            console.log('Game.queue: user %s added. queue len: %d', token, _waitingQueue.length)
            return true
        }
    }
    return self;
}

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
    const userToken = mod_token.generate(8)

    request.standartRequestHandle(
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

    request.standartRequestHandle(
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

    request.standartRequestHandle(
        res,
        () => game.getSession(query.session_token).storeCommands(req.body),
        'unable to store player command'
    )
})

dispatcher.onGet('/session_flush_turn', (req, res) => {
    const query = url_parse(req.url, true).query

    request.standartRequestHandle(
        res,
        () => game.getSession(query.session_token).flushTurn(query.user_token),
        'unable to flush turn'
    )
})

dispatcher.onGet('/keep_alive', (req, res) => {
    const query = url_parse(req.url, true).query

    request.standartRequestHandle(
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


//
// server part
//

const PORT = 8181;
const game = Game();

function onRequest(request, response) {
    try {
        console.log('incoming request: %s', request.url)
        dispatcher.dispatch(request, response)
    } catch (e) {
        console.error(e)
    }
}

var server = mod_http.createServer(onRequest);
server.listen(PORT, () => {
    console.log('server successfully run on ' + PORT)
    setInterval(game.update, 1000)
})