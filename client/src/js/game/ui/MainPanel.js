/**
 * @param owner
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {GlobalPanelConstructor} from "./panels/GlobalPanel";
import {MockupPanelConstructor} from "./panels/MockupPanel";
import {TileInfoPanelConstructor} from "./panels/TileInfoPanel";
export const MainPanelState = {
    GLOBAL: 'GLOBAL',
    SELECTOR: 'SELECTOR',
    TILE: 'TILE',
    COMMAND: 'COMMAND',
}

export const MainPanelConstructor = (owner) => {

    let showState = MainPanelState.GLOBAL

    const variations = {
        parentDiv: {
            'vertical': UIUtils.createElement('div', 'uiMainPanelVertical', owner.root, {display: 'none'}),
            'horizontal': UIUtils.createElement('div', 'uiMainPanelHorizontal', owner.root, {display: 'none'})
        }
    }

    /** @type {Element} */
    let currentMain
    /** @type {String} */
    let currentOrientation

    const self = {
        get showState() { return showState },
        setShowState(value, context = null) {
            if (value === showState) {
                if (context === null || context === undefined) return
            } else {
                variations[showState][currentOrientation].hide()
            }

            showState = value
            variations[showState][currentOrientation].show()
            if (context !== null && context !== undefined) {
                variations[showState][currentOrientation].injectContext(context)
            }
        },
        onOrientationChange: (orientation) => {
            console.log('orientation chaged: ' + orientation)
            currentOrientation = orientation
            currentMain = variations.parentDiv[orientation]
            currentMain.style.display = 'block'
            variations.parentDiv[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }

    variations[MainPanelState.GLOBAL] = {
        'vertical': GlobalPanelConstructor(owner, variations.parentDiv.vertical)
    }
    variations[MainPanelState.SELECTOR] = {
        'vertical': MockupPanelConstructor(variations.parentDiv.vertical, 'selector')
    }
    variations[MainPanelState.TILE] = {
        'vertical': TileInfoPanelConstructor(variations.parentDiv.vertical,
            () => self.setShowState(MainPanelState.GLOBAL))
    }
    variations[MainPanelState.COMMAND] = {
        'vertical': MockupPanelConstructor(variations.parentDiv.vertical, 'command')
    }

    return self
}