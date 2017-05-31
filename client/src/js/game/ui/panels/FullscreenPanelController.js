import {UIUtils} from "../UIUtils";

/**
 * Represent full screen toggle buttons
 * @param {Element} fullscreenElement
 * @param {Element} parent
 * @constructor
 */
export const FullScreenPanelControllerConstructor = (fullscreenElement, parent) => {

    const panel = UIUtils.createElement('div', 'uiFullScreenPanel', parent)
    const expand = UIUtils.createElement('button', 'uiFullScreenBtnExpand', panel)
    const collapse = UIUtils.createElement('button', 'uiFullScreenBtnCollapse', panel, {display: 'none'})

    expand.addEventListener('click', () => {
        fullscreenElement.requestFullscreen()
        expand.style.display = 'none'
        collapse.style.display = 'block'
    })

    collapse.addEventListener('click', () => {
        document.exitFullscreen()
        expand.style.display = 'block'
        collapse.style.display = 'none'
    })

    return {
    }
}