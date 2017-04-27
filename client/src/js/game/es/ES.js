/**
 * Create EntitySystem - a container for all the entities in the game.
 * Before and after update callbacks can be used to update rendering after logic update.
 * 
 * @param {Function} beforeUpdate
 * @param {Function} afterUpdate
 * @constructor
 */
export const ESConstructor = (beforeUpdate = null, afterUpdate = null) => {
    const entities = new Map()

    return {
        /**
         * Add new entity
         * @param {String} key
         * @param {*} value
         */
        add: (key, value) => { entities.set(key, value) },

        /**
         * Get specified entity
         * @param key
         * @return {*} Entity or null
         */
        get: (key) => entities.get(key),

        /**
         * Perform beforeUpdate hook, ES update, and after update hook
         */
        update: () => {

            beforeUpdate && beforeUpdate.call()

            //
            // update game entities
            entities.forEach(e => {
                if ('update' in e) {
                    e.update()
                }
            })

            afterUpdate && afterUpdate.call()
        },

        /**
         * Remove specified entity from system
         * @param {String} key
         */
        remove: (key) => { entities.remove(key) }
    }
}