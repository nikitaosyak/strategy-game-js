
export const SessionDataConstructor = () => {
    const _state = {
        initialized: false,
        userToken: '',
        token: '',
        myIndex: -1,
        players: null,
        turn: 0
    }

    return {
        get initialized() { return _state.initialized },
        get token() { return _state.token },
        get userToken() { return _state.userToken },
        get myIndex() { return _state.myIndex },
        get turn() { return _state.turn },

        /**
         * begin new session
         * @param {string} myUserToken
         * @param {string} sessionToken
         * @param {Array.<string>} players
         */
        initialize: (myUserToken, sessionToken, players) => {
            _state.initialized = true
            _state.token = sessionToken
            _state.userToken = myUserToken
            _state.players = players

            for (let i = 0; i < players.length; i++) {
                if (players[i] !== myUserToken) continue
                _state.myIndex = i
            }
        },

        /**
         * move session forward
         */
        addTurn: () => _state.turn += 1,

        /**
         * end session
         */
        reset: () => {
            _state.initialized = false
            _state.token = ''
            _state.myIndex = -1
            _state.players = null
            _state.turn = -1
        },

        traceState: () => {
            console.log(_state)
        }
    }
}