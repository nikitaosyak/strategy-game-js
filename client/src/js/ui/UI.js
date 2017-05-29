import {StatsConstructor} from "./panels/Stats";
import {FullScreenPanelControllerConstructor} from "./panels/FullscreenPanelController";
import {TurnPanelControllerConstructor} from "./panels/TurnPanelController";
import {CommandPanelControllerConstructor} from "./panels/CommandPanelController";
import {TileInfoPanelControllerConstructor} from "./panels/TileInfoPanelController";

export const UIUtils = {
    /**
     * @param {string} tag
     * @param {string} id
     * @param {Element} parent
     * @param {*} styleParams
     * @return {Element}
     */
    createElement: (tag, id, parent = null, styleParams = null) => {
        const el = document.createElement(tag)
        el.id = id
        if (parent === null || parent === undefined) {
            document.getElementById('uiRoot').appendChild(el)
        } else {
            parent.appendChild(el)
        }

        if (styleParams !== null && styleParams !== undefined) {
            for (const key in styleParams) {
                el.style[key] = styleParams[key]
            }
        }
        return el
    }
}

export const UIConstructor = () => {

    const gameCanvas = UIUtils.createElement('canvas', 'gameCanvas', document.body)

    const root = UIUtils.createElement('div', 'uiRoot', document.body)

    //
    // create main ui blocks
    const stats = StatsConstructor(root)
    const fullscreenBtn = FullScreenPanelControllerConstructor(root)
    const turnPanel = TurnPanelControllerConstructor(root)
    const commandPanel = CommandPanelControllerConstructor(root)
    const tileInfoPanel = TileInfoPanelControllerConstructor(root)

    const uiComponents = [stats, fullscreenBtn, turnPanel, commandPanel, tileInfoPanel]

    return {
        update: () => {
            uiComponents.forEach(comp => {
                if ('update' in comp) {
                    comp.update()
                }
            })
        }
    }
}