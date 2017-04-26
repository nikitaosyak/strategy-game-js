/**
 * @param {string} name
 * @param {number} index
 * @param {number} template
 * @constructor
 */
import {componentGetName, componentGetNeighbour, componentInjectOwner} from "./es/componentBehaviours";
import {debugTraceState} from "../util/behaviours";

export const HexagonConstructor = (name, index, template) => {
    const state = {
        name: name,
        index: index,
        template: template
    }

    const self = {
        get index() { return state.index },
        init: () => {
            const visual = self.getNeighbour('visual')

            if (visual.loaded) {
                switch (state.template) {
                    case 0: // empty
                        visual.mesh.material.color.setHex(0xFFFFFF)
                        break
                    case 1: // start point
                        visual.mesh.material.color.setHex(0xCC0000)
                        break
                    case 10: // resource point
                        visual.mesh.material.color.setHex(0x0000CC)
                        break
                    case 20: // wall point
                        visual.mesh.material.color.setHex(0x000000)
                        break
                    default:
                        throw 'Hexagon.init: unknown hexagon template'
                        break
                }
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