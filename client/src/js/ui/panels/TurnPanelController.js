import {UIUtils} from "../UI";

/**
 * Represents the time left of the current turn
 * @param {Element} parent
 * @constructor
 */
export const TurnPanelControllerConstructor = (parent) => {
    const panel = UIUtils.createElement('div', 'uiTurnPanel', parent)

    return {
        update: () => {}
    }
}