import {visualLoader} from './../util/behaviours'

/**
 * @param {string} name
 * @param {number} index
 * @param {number} template
 * @param {string} visualPath
 * @returns {{name, index, visual}}
 * @constructor
 */
export const HexagonConstructor = (name, index, template, visualPath) => {
    let _state = {
        name: name,
        index: index,
        visualPath: visualPath,
        template: template,
        visual: null
    }

    const self = {
        get name() { return _state.name },
        get index() { return _state.index },
        get visual() { return _state.visual },
        init: () => {
            if (_state.visual === null) throw 'Cannot init before visual loaded'

            switch (_state.template) {
                case 0: // empty
                    _state.visual.material.color.setHex(0xFFFFFF)
                    break
                case 1: // start point
                    _state.visual.material.color.setHex(0xCC0000)
                    break
                case 10: // resource point
                    _state.visual.material.color.setHex(0x0000CC)
                    break
                case 20: // wall point
                    _state.visual.material.color.setHex(0x000000)
                    break
                default:
                    throw 'Hexagon.init: unknown hexagon template'
                    break
            }
        }
    }
    Object.assign(self, visualLoader(_state))
    return self;
}