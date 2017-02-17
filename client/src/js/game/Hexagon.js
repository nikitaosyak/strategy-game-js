import {visualLoader} from './../util/behaviours'

/**
 * @param {string} name
 * @param {number} index
 * @param {string} visualPath
 * @returns {{name, index, visual}}
 * @constructor
 */
export const HexagonConstructor = (name, index, visualPath) => {
    let _state = {
        name: name,
        index: index,
        visualPath: visualPath,
        visual: null
    }

    console.log('hexagon created: ', _state)

    const self = {
        get name() { return _state.name },
        get index() { return _state.index },
        get visual() { return _state.visual },
    }
    Object.assign(self, visualLoader(_state))
    return self;
}