import {
    entityAddComponent,
    entityGetComponent,
    entityGetName,
    entityUpdate
} from "../entityBehaviours";

/**
 * Final entity for structures and units. Cannot contain children.
 *
 * @param {String} name         entity name
 * @param {String} type         [structure|unit]
 * @param {String} possessor    user token indicating the owner of the entity
 * @throws Exception on attempt to operate on children
 * @constructor
 */
export const GameEntityConstructor = (name, type, possessor) => {
    const state = {
        //
        // entity state
        name: name,
        components: new Map(),

        //
        // custom state
        type: type,
        possessor: possessor
    }

    const self = {
        get type() { return state.type },
        get possessor() { return state.possessor }
    }

    Object.assign(self, entityGetName(state))
    Object.assign(self, entityUpdate(state))

    Object.assign(self, entityAddComponent(self, state))
    Object.assign(self, entityGetComponent(state))

    return self
}