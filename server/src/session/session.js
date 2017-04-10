'use strict'

module.exports.createSession = (token, user1, user2) => {
    const settings = require('./../util/settings').content
    const player = require('./player')
    const request = require('../util/request_util')

    const State = {
        WAITING_USERS: 'waiting_users',
        TURN_IN_PROGRESS: 'turn_in_progress',
        BETWEEN_TURN_PAUSE: 'between_turn_pause',
        SESSION_ENDED: 'session_ended'
    }

    const _users = [user1, user2]
    const _players = []

    let _turn = 0
    let _turnCommands = []


    let _countStarted = 0

    let _state = State.WAITING_USERS

    //
    // inner play logic
    const _startTurn = () => {
        _countStarted = Date.now()
        _state = State.TURN_IN_PROGRESS
        Logger.log('Session: new turn #%d', _turn)
    }

    const _endTurn = () => {
        const turnCommandsStr = JSON.stringify({status: 'OK', commands: _turnCommands})
        _turnCommands = []
        Logger.info('Session: will send commands: %s', turnCommandsStr)
        _players.forEach((p, i) => {
            if (_state === State.SESSION_ENDED) return

            if (p.getUser().isStale()) {
                Logger.warn('Session:endTurn: user %d is stale!', i)
                _endSession()
                return
            }

            const hook = p.getTurnHook()
            if (hook === null) {
                Logger.warn(p.getUser().getToken() + ': Hook not set!')
                _endSession()
                return
            }
            request.send_ok(hook, turnCommandsStr)
            p.resetTurnState()
        })

        _state = State.BETWEEN_TURN_PAUSE
        _countStarted = Date.now()
        Logger.log('Session: end of turn #%d', _turn)

        _turn += 1
    }

    const _endSession = () => {
        // todo: this shit requires proper destruction
        _state = State.SESSION_ENDED
    }

    //
    // public methods
    const self = {
        isDone: () => State === State.SESSION_ENDED,
        getToken: () => _token,
        getPlayer: (userToken) => {
            for (let i = 0; i < _players.length; i++) {
                const user = _players[i].getUser()
                if (user.getToken() === userToken) return _players[i]
            }
            return null
        },

        //
        // user commands
        userReady: (userToken) => {
            let success = false
            _users.forEach(user => {
                console.log('requesting ready. usertoken: ' + userToken)
                if (user.getToken() === userToken) {
                    Logger.log('Session:userReady: approving player %s', user.getToken())
                    _players.push(player.createPlayer(user))
                    success = true
                }
            })

            if (_players.length === _users.length) {
                Logger.log('Session:userReady: all users are ready! match starting!')
                _startTurn()
            }
            return success
        },

        storeHook: (userToken, turnNumber, response) => {
            if (turnNumber !== _turn)
                return "run numbers does not match. intended: " + _turn + "; player send: " + turnNumber
            const p = self.getPlayer(userToken)
            if (p === null) {
                _endSession()
                return 'player with token ' + userToken + ' does not exists'
            }

            const result = p.setTurnHook(response)
            if (result === true) return result
            _endSession()
            return result
        },

        storeCommands: (value) => {
            let success = true
            const commandList = JSON.parse(value)
            commandList.forEach(cmd => {
                if (cmd.turn === _turn) {
                    Logger.log('player %s command: %s', cmd.user_token, cmd.command)
                    _turnCommands.push(cmd)
                } else {
                    success = false
                }
            })
            return success
        },

        flushTurn: (userToken, turnNumber) => {
            if (turnNumber !== _turn) return false
            const p = self.getPlayer(userToken)
            if (p === null) return false
            p.flushTurn()
        },

        //
        // update
        update: () => {
            if (_state === State.SESSION_ENDED) return

            const elapsed = (Date.now() - _countStarted) / 1000
            // Logger.info('turn time: %i. turn state: %s', elapsed, _state)

            if (_state === State.TURN_IN_PROGRESS) {
                if (elapsed >= settings.lobby.turnTime) { // turn ended due to timeout
                    _endTurn()
                } else {                     // turn ended due to players flush
                    let flushes = 0
                    for (let i = 0; i < _players.length; i++) {
                        if (_players[i].getTurnFlushed()) {
                            flushes += 1
                        }
                    }
                    if (flushes === _players.length) {
                        _endTurn()
                    }
                }
            }

            if (_state === State.BETWEEN_TURN_PAUSE && elapsed >= settings.lobby.turnPauseTime) {
                _startTurn()
            }
        }
    }

    if (ENV === 'TEST') {
        self.State = State
        self._users = _users
        self._players = _players
        self._getTurn = () => _turn
        self._turnCommands = _turnCommands
        self._getCountStarted = () => _countStarted
        self._getState = () => _state
    }

    return self
}
