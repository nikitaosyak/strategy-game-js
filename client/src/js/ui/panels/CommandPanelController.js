import {UIUtils} from "../UI";

/**
 * Panel for issuing commands to units or buildings
 * @param {Element} parent
 * @constructor
 */
export const CommandPanelControllerConstructor = (parent) => {

    const panel = UIUtils.createElement('div', 'uiCommandMenu', parent)
    const buttons = [
        UIUtils.createElement('button', 'uiBtnCommand0', panel, {display: 'none'}),
        UIUtils.createElement('button', 'uiBtnCommand1', panel, {display: 'none'}),
        UIUtils.createElement('button', 'uiBtnCommand2', panel, {display: 'none'}),
        UIUtils.createElement('button', 'uiBtnCommand3', panel, {display: 'none'})
    ]

    return {
        show: (cmdList) => {

        }
    }
}