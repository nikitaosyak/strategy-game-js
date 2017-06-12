import {componentGetName, componentGetNeighbour, componentInjectOwner} from "../componentBehaviours";
import {debugTraceState} from "../../../util/behaviours";

export const TEMPLATES = {
    0: {
        debugName: 'PLAIN',
        debugColor: 0xFFFFFF,
        walkable: true
    },
    1: {
        debugName: 'BASE',
        debugColor: 0xCC0000,
        walkable: true
    },
    10: {
        debugName: 'RESOURCE',
        debugColor: 0x0000CC,
        walkable: false
    },
    20: {
        debugName: 'WALL',
        debugColor: 0x000000,
        walkable: false
    }
}

/**
 * @param name
 * @param index
 * @param template
 * @constructor
 */
export const HexagonComponentConstructor = (name, index, template) => {
    const state = {
        name: name,
        index: index,
        template: template
    }

    const self = {
        get index() { return state.index },
        get templateData() { return TEMPLATES[state.template] },
        get currentResource() { return state.template === 10 ? 200 : 0 },
        init: () => {
            const visual = self.getNeighbour('visual')

            if (visual.isLoaded) {
                visual.mesh.material.color.setHex(TEMPLATES[state.template].debugColor)
            } else {
                throw 'Cannot init before visual loaded'
            }
        }
    }

    Object.assign(self, componentGetName(state))
    Object.assign(self, componentInjectOwner(state))
    Object.assign(self, componentGetNeighbour(state))
    Object.assign(self, debugTraceState(state))
    return self;
}