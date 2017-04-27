export const entityGetName = (name) => ({
    /** @returns {String} */
    get name() { return name }
})

/**
 * @param {Map} components
 * @param {Array} children
 */
export const entityUpdate = (components, children) => ({
    /**
     * Perform update cycle of an entity:
     * Update all components in current entity
     * Update all containing entities
     */
    update: () => {
        components.forEach(comp => {
            if ('update' in comp) {
                comp.update()
            }
        })

        children.forEach(child => {
            if ('update' in child) {
                child.update()
            }
        })
    }
})

/** @param {Array} children */
export const entityAddChild = (children) => ({
    /**
     * Add child entity
     * @param {*} value
     */
    addChild: (value) => {
        children.push(value)
    }
})

/** @param {Array} children */
export const entityGetAnyChildren = (children) => ({
    /**
     * Does current entity contains any child entities
     * @returns {boolean}
     */
    anyChildren: () => { return children.length > 0 }
})

/** @param {Array} children */
export const entityGetChildren = (children) => ({
    /**
     * Get the list of current entities children
     * @returns {Array}
     */
    getChildren: () => { return children }
})

/**
 * @param {*} self
 * @param {Map} components
 */
export const entityAddComponent = (self, components) => ({
    /**
     * Add Component to current entity
     * @param {string} key
     * @param {*} value
     * @returns {*} value
     */
    addComponent: (key, value) => {
        value.injectOwner(self)
        components.set(key, value)
        return value
    }
})

/** @param {Map} components */
export const entityGetComponent = (components) => ({
    /**
     * Get Component of current entity
     * @param key
     * @returns {*} component
     */
    getComponent: (key) => { return components.get(key) }
})