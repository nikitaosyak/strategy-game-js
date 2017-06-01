/**
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {StatsConstructor} from "./panels/Stats";
import {MainPanelConstructor} from "./MainPanel";

export const UIConstructor = () => {

    const ownerProxy = {
        root: document.body,
        fullscreenElement: window.document.documentElement,
        es: null,
        cmd: null
    }

    const gameCanvas = UIUtils.createElement('canvas', 'gameCanvas', ownerProxy.root)

    //
    // create main ui blocks
    const stats = StatsConstructor(ownerProxy.root)
    const main = MainPanelConstructor(ownerProxy)

    return {
        inject: (es, commands) => {
            ownerProxy.es = es
            ownerProxy.cmd = commands
        },
        /** @return {Element} */
        get root() { return ownerProxy.root },
        /** @return {Element} */
        get canvas() { return gameCanvas },

        onOrientationChange: (orientation) => {
            main.onOrientationChange(orientation)
        },
        /** update all UI panels */
        update: () => {
            main.update()
        }
    }
}