export const entityGetName = (state) => ({
    /** @returns {String} */
    get name() { return state.name }
})

export const entityUpdate = (state) => ({
    /**
     * Perform update cycle of an entity:
     * Update all components in current entity
     * Update all containing entities
     */
    update: () => {
        state.components.forEach(comp => {
            if ('update' in comp) {
                comp.update()
            }
        })

        state.children.forEach(child => {
            if ('update' in child) {
                child.update()
            }
        })
    }
})

export const entityAddChild = (state) => ({
    /**
     * Add child entity
     * @param {*} value
     */
    addChild: (value) => {
        state.children.push(value)
    }
})

export const entityGetAnyChildren = (state) => ({
    /**
     * Does current entity contains any child entities
     * @returns {boolean}
     */
    anyChildren: () => { return state.children.length > 0 }
})

export const entityGetChildren = (state) => ({
    /**
     * Get the list of current entities children
     * @returns {Array}
     */
    getChildren: () => { return state.children }
})

export const entityAddComponent = (self, state) => ({
    /**
     * Add Component to current entity
     * @param {string} key
     * @param {*} value
     * @returns {*} value
     */
    addComponent: (key, value) => {
        value.injectOwner(self)             // inject parent entity in the target component
        state.components.set(key, value)    // add target component to entity component map
        return value                        // return component for convenience
    }
})

export const entityGetComponent = (state) => ({
    /**
     * Get component of current entity
     * @param key
     * @returns {*} component
     */
    getComponent: (key) => { return state.components.get(key) }
})