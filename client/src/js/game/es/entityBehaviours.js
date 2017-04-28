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
        if ('components' in state) {
            state.components.forEach(comp => {
                if ('update' in comp) {
                    comp.update()
                }
            })
        }

        if ('children' in state) {
            state.children.forEach(child => {
                if ('update' in child) {
                    child.update()
                }
            })
        }
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

export const entityGetChild = (state) => ({
    /**
     * Get entity child at index
     * @param {Number} index
     * @return {*} child at index
     * @throws exception
     */
    getChild: (index) => state.children[index]
})

export const entityRemoveChild = (state) => ({
    /**
     * @param {Number} index
     * @return {*} spliced child
     * @throws exception
     */
    removeChild: (index) => state.children.splice(index, 1)
})

export const entityGetAnyChildren = (state) => ({
    /**
     * Does current entity contains any child entities
     * @returns {boolean}
     */
    anyChildren: () => { return state.children && state.children.length > 0 }
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