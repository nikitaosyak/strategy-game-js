import {UIUtils} from "../UIUtils";
import {contextInject, elementHide, elementShow} from "../uiBehaviours";

export const MockupPanelConstructor = (parent, mockupName) => {

    const state = {
        active: false,
        context: null,
        element: UIUtils.createElement('div', mockupName, parent, {display: 'none'}, 'panelDiv'),
        invalidateView: () => {
            // console.log(state.active, state.context)
        }
    }

    state.element.innerHTML = mockupName

    const self = {}
    Object.assign(self, elementShow(state))
    Object.assign(self, elementHide(state))
    Object.assign(self, contextInject(state))

    return self
}