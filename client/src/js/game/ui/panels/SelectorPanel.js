import {UIUtils} from "../UIUtils";
import {CancelButtonConstructor} from "../components/CancelButton";
import {contextInject, elementHide, elementShow} from "../uiBehaviours";
export const SelectorPanelConstructor = (parent, selectorCallback, cancelBehaviour) => {

    const panel = UIUtils.createElement('div', 'uiSelectorPanel', parent, {display: 'none'}, 'panelDiv')
    const selectionButtons = []

    const state = {
        active: false,
        context: null,
        element: panel,
        invalidateView: () => {
            if (state.context === null) return
            for (let i = 0; i < 4; i++) {
                if (i < state.context.length) {
                    const t = state.context[i].template
                    // console.log(selectionButtons[i])
                    selectionButtons[i].setBackground('./assets/ui/stillIcons/' + t.type + '/' + t.class + '.png')
                    selectionButtons[i].style.display = 'inline-block'
                    // todo: extract context item and render appropriate icon
                    // icon background, possible overlay, exclude drained entities
                } else {
                    selectionButtons[i].style.display = 'none'
                }
            }
        }
    }

    //
    // create panel buttons
    for (let i = 0; i < 4; i++) {
        selectionButtons[i] = UIUtils.createButtonElement(
            panel,
            './assets/ui/mockup_image.png',
            () => {selectorCallback(state.context[i])},
            {'display': 'none'}
        )
    }
    CancelButtonConstructor(cancelBehaviour, panel)

    const self = {}
    Object.assign(self, elementShow(state))
    Object.assign(self, elementHide(state))
    Object.assign(self, contextInject(state))

    return self
}