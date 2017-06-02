import {elementHide, elementShow} from "../uiBehaviours";
import {UIUtils} from "../UIUtils";
import {FullScreenButtonConstructor} from "../components/FullscreenButton";
export const GlobalPanelConstructor = (owner, parent) => {

    const state = {
        element: UIUtils.createElement('div', 'uiGlobalPanel', parent, null, 'panelDiv')
    }

    FullScreenButtonConstructor(owner.fullscreenElement, state.element)

    const self = {}
    Object.assign(self, elementShow(state))
    Object.assign(self, elementHide(state))

    return self
}