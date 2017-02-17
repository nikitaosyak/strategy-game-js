
export const SessionConstructor = () => {
    const _state = {
        initialized: false,
        token: '',
        myIndex: -1,
        players: null,
        turn: -1
    }

    return {
        get initialized() { return _state.initialized },
        get token() { return _state.token },
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
            _state.players = players

            for (let i = 0; i < players; i++) {
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
        }
    }
}