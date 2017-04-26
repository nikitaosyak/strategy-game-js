export const entityGetName = (name) => ({get name() { return name }})

/**
 * @param {Map} components
 * @param {Array} children
 */
export const entityUpdate = (components, children) => ({update: () => {
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
}})

/** @param {Array} children */
export const entityAddChild = (children) => ({
    /** @param {*} value add entity child*/
    addChild: (value) => {
        children.push(value)
    }
})

/** @param {Array} children */
export const entityGetAnyChildren = (children) => ({
    /** @returns {boolean} */
    anyChildren: () => { return children.length > 0 }
})

/** @param {Array} children */
export const entityGetChildren = (children) => ({
    /** @returns {Array} */
    getChildren: () => { return children }
})

/**
 * @param {*} self
 * @param {Map} components
 */
export const entityAddComponent = (self, components) => ({
    /**
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
     * @param key
     * @returns {*} component
     */
    getComponent: (key) => { return components.get(key) }
})