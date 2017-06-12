import {UIUtils} from "../UIUtils";
import {contextInject, elementHide, elementShow} from "../uiBehaviours";
import {InfoComponentConstructor} from "../components/InfoComponent";
import {CancelButtonConstructor} from "../components/CancelButton";
export const TileInfoPanelConstructor = (parent, cancelBehaviour) => {

    const panel = UIUtils.createElement('div', 'uiTileInfoPanel', parent, {display: 'none'}, 'panelDiv')
    const infoComp = InfoComponentConstructor('tileInfoInfo', panel)
    CancelButtonConstructor(cancelBehaviour, panel)

    const state = {
        active: false,
        context: null,
        element: panel,
        invalidateView: () => {
            if (state.context === null) return
            const comp = state.context.getComponent('logic')
            infoComp.setInfo(
                comp.templateData.debugName,
                comp.templateData.walkable ? 'walkable' : 'unwalkable',
                comp.currentResource > 0 ? 'mana: ' + comp.currentResource : null)
        }
    }

    const self = {}
    Object.assign(self, elementShow(state))
    Object.assign(self, elementHide(state))
    Object.assign(self, contextInject(state))

    return self
}