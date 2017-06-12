import {UIUtils} from "../UIUtils";
import {contextInject, elementHide, elementShow} from "../uiBehaviours";

export const CommandPanelConstructor = (parent) => {

    const state = {
        active: false,
        context: null,
        element: UIUtils.createElement('div', 'uiCommandPanel', parent, {display: 'none'}, 'panelDiv'),
        invalidateView: () => {
            if (state.context === null) return
            state.element.innerHTML = 'command to ' + state.context.type + ' ' + state.context.name
        }
    }

    const self = {}
    Object.assign(self, elementShow(state))
    Object.assign(self, elementHide(state))
    Object.assign(self, contextInject(state))

    return self
}