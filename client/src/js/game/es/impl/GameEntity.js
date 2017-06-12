import {
    entityAddComponent,
    entityGetComponent,
    entityGetName,
    entityUpdate
} from "../entityBehaviours";

/**
 * @param {string} name
 * @param {string} type
 * @param {string} cls
 * @return {{name, type, class}}
 * @constructor
 */
export const GameEntityTemplateConstructor = (name, type, cls) => {
    return {
        get name() { return name },
        get type() { return type },
        get class() { return cls },
        toString: () => {
            return '[eTemplate: ' + name + '; class: ' + cls + '; type: ' + type + ']'
        }
    }
}

/**
 * Final entity for structures and units. Cannot contain children.
 *
 * @param template
 * @param {String} possessor    user token indicating the owner of the entity
 * @throws Exception on attempt to operate on children
 * @constructor
 */
export const GameEntityConstructor = (template, possessor) => {
    const state = {
        //
        // entity state
        name: template.name,
        components: new Map(),

        //
        // custom state
        template: template,
        possessor: possessor
    }

    const self = {
        get template() { return state.template },
        get possessor() { return state.possessor }
    }

    Object.assign(self, entityGetName(state))
    Object.assign(self, entityUpdate(state))

    Object.assign(self, entityAddComponent(self, state))
    Object.assign(self, entityGetComponent(state))

    return self
}