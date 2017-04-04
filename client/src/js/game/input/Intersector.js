import {intersectSelectionTest} from "../../util/behaviours";

export const IntersectorConstructor = (camera) => {

    const _state = {
        selected: Number.NaN,
        camera: camera
    }

    const self = {
        get anySelected() { return !Number.isNaN(_state.selected) },
        get selection() { return _state.selected },
        update: () => { _state.selected = Number.NaN }
    }

    Object.assign(self, intersectSelectionTest(_state))
    return self
}