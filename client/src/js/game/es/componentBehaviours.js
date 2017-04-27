export const componentGetName = (state) => ({
    /**
     * @returns {String} name
     */
    get name() { return state.name }
})

export const componentInjectOwner = (state) => ({
    /**
     * Set the owner of the current component.
     * This is a utility function and should be only called
     * by entity system
     * @param {*} owner
     */
    injectOwner: (owner) => { state.owner = owner }
})

export const componentGetNeighbour = (state) => ({
    /**
     * Get neighbour component
     * @param {String} key
     * @returns {*} component or null
     */
    getNeighbour: (key) => state.owner.getComponent(key)
})