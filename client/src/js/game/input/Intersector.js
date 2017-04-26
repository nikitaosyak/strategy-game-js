import {intersectSelectionTest} from "../../util/behaviours";

export const IntersectorConstructor = (camera) => {

    const _state = {
        selected: null,
        camera: camera
    }

    const self = {
        /** @returns {boolean} */
        get anySelected() { return _state.selected !== null },
        /** @returns {*} selected component or null */
        get selection() { return _state.selected },

        update: () => { _state.selected = null }
    }

    Object.assign(self, intersectSelectionTest(_state))
    return self
}