import {
    entityAddChild, entityAddComponent, entityGetAnyChildren, entityGetChildren, entityGetComponent, entityGetName,
    entityUpdate
} from "./entityBehaviours";

/**
 * Create entity as a container for components
 * @param name Name is for easy debug purposes
 * @constructor
 */
export const EntityConstructor = (name) => {

    const state = {
        name: name,
        components: new Map(),
        children: []
    }

    const self = {}

    Object.assign(self, entityGetName(state))
    Object.assign(self, entityUpdate(state))

    Object.assign(self, entityAddChild(state))
    Object.assign(self, entityGetAnyChildren(state))
    Object.assign(self, entityGetChildren(state))

    Object.assign(self, entityAddComponent(self, state))
    Object.assign(self, entityGetComponent(state))

    return self
}