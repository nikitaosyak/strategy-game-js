
const util = require('./util/test_util')

describe('Lobby tests', () => {
    before(util.run)
    after(util.stop)

    let users = []
    let sessionToken = null

    const createUser = () => {
        let serverResponse = null
        it('user creation status should be OK', (done) => {
            util.getRequest('hello', (response) => {
                serverResponse = response
                users.push(serverResponse.token)
                util.assert.equal(response.status, 'OK')
                done()
            })
        })

        it('response must contain string token of the correct length', () => {
            util.assert.equal(typeof serverResponse.token, typeof '')
            util.assert.equal(serverResponse.token.length, 8)
        })

        it('game lobby should contain user of given token', () => {
            let user = util.appState.game.getUser(serverResponse.token)
            util.assert.notEqual(user, null)
            util.assert.notEqual(user, undefined)
            util.assert.equal(user.getToken(), serverResponse.token)
        })
    }

    describe('#first user creating:', createUser)
    describe('#second user just to be sure:', createUser)
    describe('#check users integrity:', () => {
        it('game lobby should contain exactly 2 users', () => {
            util.assert.equal(util.appState.game._users.size, 2)
        })

        it('game lobby should not contain any sessions', () => {
            util.assert.equal(util.appState.game._sessions.size, 0)
        })

        it('waiting queue should be empty at this point', () => {
            util.assert.equal(util.appState.game._waitingQueue.length, 0)
        })
    })

    describe('#enqueue both users:', () => {
        it('both received session accept', (done) => {
            let usersDone = 0
            for (let i = 0; i < users.length; i++) {
                util.getRequest('queue?user_token=' + users[i], (response) => {
                    util.assert.equal(response.status, 'OK')
                    util.assert.equal(typeof response.session_token, typeof '')
                    util.assert.equal(response.session_token.length, 8)
                    util.assert.equal(response.users.length, 2)

                    for (let k = 0; k < response.users.length; k++) {
                        util.assert.notEqual(users.indexOf(response.users[i]), -1)
                    }

                    sessionToken = response.session_token
                    usersDone += 1
                    if (usersDone == users.length) {
                        done()
                    }
                })
            }
        })
    })

    describe('#correct lobby state:', () => {
        it('lobby now should contain correct session with given token', () => {
            const s = util.appState.game.getSession(sessionToken)
            util.assert.notEqual(s, null)
            util.assert.notEqual(s, undefined)
        })

        it('lobby should contain exactly one session', () => {
            util.assert.equal(util.appState.game._sessions.size, 1)
        })

        it('lobby should contain zero users in the queue', () => {
            util.assert.equal(util.appState.game._waitingQueue, 0)
        })
    })

    describe('#correct session state: WAITING_USERS: ', () => {
        it('users present', () => {
            const s = util.appState.game.getSession(sessionToken)
            util.assert.equal(s._users.length, 2)
            for (let i = 0; i < s._users.length; i++) {
                util.assert.notEqual(users.indexOf(s._users[i].getToken()), -1)
            }
        })

        it('players absent', () => {
            const s = util.appState.game.getSession(sessionToken)
            util.assert.equal(s._players.length, 0)
        })

        it('turn is zero', () => {
            const s = util.appState.game.getSession(sessionToken)
            util.assert.equal(s._getTurn(), 0)
        })

        it('state is correct', () => {
            const s = util.appState.game.getSession(sessionToken)
            util.assert.equal(s._getState(), s.State.WAITING_USERS)
        })
    })
})