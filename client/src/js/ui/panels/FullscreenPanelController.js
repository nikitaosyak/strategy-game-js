import {UIUtils} from "../UI";
export const FullScreenPanelControllerConstructor = (parent) => {

    const panel = UIUtils.createElement('div', 'uiFullScreenPanel', parent)
    const expand = UIUtils.createElement('button', 'uiFullScreenBtnExpand', panel)
    const collapse = UIUtils.createElement('button', 'uiFullScreenBtnCollapse', panel)
    collapse.style.display = 'none'

    return {
        update: () => {}
    }
}