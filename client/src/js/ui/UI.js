import {StatsConstructor} from "./panels/Stats";
import {FullScreenPanelControllerConstructor} from "./panels/FullscreenPanelController";
import {TurnPanelControllerConstructor} from "./panels/TurnPanelController";

export const UIUtils = {
    /**
     * @param {string} tag
     * @param {string} id
     * @param {Element} parent
     * @return {Element}
     */
    createElement: (tag, id, parent = null) => {
        const el = document.createElement(tag)
        el.id = id
        if (parent === null || parent === undefined) {
            document.getElementById('uiRoot').appendChild(el)
        } else {
            parent.appendChild(el)
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

    const uiComponents = [stats, fullscreenBtn, turnPanel]

    return {
        update: () => {
            uiComponents.forEach(comp => comp.update())
        }
    }
}