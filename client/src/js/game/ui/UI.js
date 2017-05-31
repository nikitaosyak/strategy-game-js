/**
 * @constructor
 */
import {StatsConstructor} from "./panels/Stats";
import {FullScreenPanelControllerConstructor} from "./panels/FullscreenPanelController";
import {TurnPanelControllerConstructor} from "./panels/TurnPanelController";
import {CommandPanelControllerConstructor} from "./panels/CommandPanelController";
import {TileInfoPanelControllerConstructor} from "./panels/TileInfoPanelController";
import {UIUtils} from "./UIUtils";

export const UIConstructor = () => {
    const gameCanvas = UIUtils.createElement('canvas', 'gameCanvas', document.body)
    const uiRoot = UIUtils.createElement('div', 'uiRoot', document.body)

    const ownerProxy = {
        root: uiRoot,
        es: null,
        cmd: null
    }

    //
    // create main ui blocks
    const stats = StatsConstructor(uiRoot)
    const fullscreenBtn = FullScreenPanelControllerConstructor(window.document.documentElement, document.body)
    const turnPanel = TurnPanelControllerConstructor(uiRoot)
    const commandPanel = CommandPanelControllerConstructor(ownerProxy)
    const tileInfoPanel = TileInfoPanelControllerConstructor(ownerProxy)
    //
    const uiComponents = [stats, fullscreenBtn, turnPanel, commandPanel, tileInfoPanel]

    return {
        inject: (es, commands) => {
            ownerProxy.es = es
            ownerProxy.cmd = commands
        },
        /** @return {Element} */
        get root() { return uiRoot },
        /** @return {Element} */
        get canvas() { return gameCanvas },
        /** update all UI panels */
        update: () => {
            uiComponents.forEach(comp => {
                if ('update' in comp) {
                    comp.update()
                }
            })
        }
    }
}