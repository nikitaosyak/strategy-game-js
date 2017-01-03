'use strict'

module.exports.createUser = (token) => {
    let lastUpdateTime = Date.now()

    const self = {
        //
        // values to have
        getToken: () => token,

        //
        // expiration logic block
        keepAlive: () => {
            let success = false

            if (self.isStale()) {
                success = false
            } else {
                lastUpdateTime = Date.now()
            }
            return success
        },
        isStale: () => (Date.now() - lastUpdateTime) > settings.game.userStaleTime,
    }
    return self
}