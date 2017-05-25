import {StatsConstructor} from "./Stats";
import {FullScreenBtnControllerConstructor} from "./buttons/fullscreenBtnController";
import {TurnPanelControllerConstructor} from "./buttons/turnPanelController";

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

    const root = UIUtils.createElement('div', 'uiRoot', document.body)

    //
    // create main ui blocks
    const stats = StatsConstructor()
    const fullscreenBtn = FullScreenBtnControllerConstructor(root)
    const turnPanel = TurnPanelControllerConstructor(root)

    return {
        update: () => {
            stats.update()
        }
    }
}