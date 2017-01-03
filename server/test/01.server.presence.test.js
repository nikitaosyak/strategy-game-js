
const util = require('./util/test_util')

describe('Server presence', () => {
    before(util.run)
    after(util.stop)

    describe('#ping:', () => {
        it('server\'s message must be pong', (done) => {
            util.getRequest('ping', (response) => {
                util.assert.equal(response.message, 'pong')
                done()
            })
        })
    })

    describe('#404Error:', () => {
        const invalidPath = util.randomSequence(16)

        it('server\'s message should be "invalid url"', (done) => {
            util.getRequest(invalidPath, (response) => {
                util.assert.equal(response.message, 'invalid url')
                done()
            })
        })

        it('path in message should match the original path', (done) => {
            util.getRequest(invalidPath, (response) => {
                util.assert.equal(response.path, '/' + invalidPath)
                done()
            })
        })
    })

})