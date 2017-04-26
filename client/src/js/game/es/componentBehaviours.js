export const componentGetName = (state) => ({get name() { return state.name }})

export const componentInjectOwner = (state) => ({
    injectOwner: (owner) => { state.owner = owner }
})

export const componentGetNeighbour = (state) => ({
    getNeighbour: (key) => state.owner.getComponent(key)
})