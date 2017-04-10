'use strict'

module.exports.createPlayer = (user) => {
    Logger.info('Player: created for user ', user.getToken())
    let _turnHook = null
    let _turnFlushed = false

    return {
        getUser: () => user,
        getTurnFlushed: () => _turnFlushed,
        getTurnHook: () => _turnHook,

        flushTurn: () => _turnFlushed = true,
        setTurnHook: (response) =>  {
            if (_turnHook !== null) {
                return 'turn hook already exists on player: ' + user.token
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
