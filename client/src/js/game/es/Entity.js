/**
 * Create entity as a container for components
 * @param name Name is for easy debug purposes
 * @constructor
 */
import {
    entityAddChild, entityAddComponent, entityChildCount, entityGetChild, entityGetComponent,
    entityGetName,
    entityUpdate
} from "./entityBehaviours";

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
    Object.assign(self, entityGetChild(state))
    Object.assign(self, entityChildCount(state))

    Object.assign(self, entityAddComponent(self, state))
    Object.assign(self, entityGetComponent(state))

    return self
}