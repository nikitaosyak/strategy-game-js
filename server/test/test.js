
const assert = require('assert')

describe('hooks', () => {

    before('setting server up', () => {
        require('../src/app').RunApp(9090)
    })

    describe('#Is server up2', () => {
        it('should be equal', () => {
            assert.equal(-1, -1)
        })
    })

    describe('Is server up', () => {
        describe('#alala', () => {
            it('should be equal', () => {
                assert.equal(1, 1)
            })
        })
    })

    describe('Is server up3', () => {
        describe('#alala3', () => {
            it('should be equal', () => {
                assert.equal(1, 1)
            })
        })
    })

    describe('Is server up4', () => {
        describe('#alala3', () => {
            it('should be equal', () => {
                assert.equal(1, 1)
            })
        })
    })
})