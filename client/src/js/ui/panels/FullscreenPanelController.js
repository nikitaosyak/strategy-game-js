import {UIUtils} from "../UI";

/**
 * Represent full screen toggle buttons
 * @param {Element} parent
 * @constructor
 */
export const FullScreenPanelControllerConstructor = (parent) => {

    const panel = UIUtils.createElement('div', 'uiFullScreenPanel', parent)
    const expand = UIUtils.createElement('button', 'uiFullScreenBtnExpand', panel)
    const collapse = UIUtils.createElement('button', 'uiFullScreenBtnCollapse', panel, {display: 'none'})

    return {
    }
}