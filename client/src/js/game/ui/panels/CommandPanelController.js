import {UIUtils} from "../UIUtils";

/**
 * Panel for issuing commands to units or buildings
 * @param owner
 * @constructor
 */
export const CommandPanelControllerConstructor = (owner) => {

    const panel = UIUtils.createElement('div', 'uiCommandMenu', owner.root)
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