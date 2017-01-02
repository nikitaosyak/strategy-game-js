'use strict'

module.exports.createPlayer = (user) => {
    console.log('Player: created for user %s', user.getToken())
    let _turnHook = null
    let _turnFlushed = false

    return {
        getUser: () => user,
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