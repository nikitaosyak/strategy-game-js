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

    const components = new Map()
    const children = []

    const self = {}

    Object.assign(self, entityGetName(name))
    Object.assign(self, entityUpdate(components, children))

    Object.assign(self, entityAddChild(children))
    Object.assign(self, entityGetAnyChildren(children))
    Object.assign(self, entityGetChildren(children))

    Object.assign(self, entityAddComponent(self, components))
    Object.assign(self, entityGetComponent(components))

    return self
}