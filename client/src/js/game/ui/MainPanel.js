/**
 * @param owner
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {GlobalPanelConstructor} from "./panels/GlobalPanel";
export const StatusPanelState = {
    GLOBAL: 'GLOBAL',
    SELECTOR: 'SELECTOR',
    TILE: 'TILE',
    STRUCTURE: 'STRUCTURE',
    UNIT: 'UNIT'
}

export const MainPanelConstructor = (owner) => {

    let showState = StatusPanelState.GLOBAL

    const variations = {
        parentDiv: {
            'horizontal': UIUtils.createElement('div', 'uiMainPanelHorizontal', owner.root, {display: 'none'}),
            'vertical': UIUtils.createElement('div', 'uiMainPanelVertical', owner.root, {display: 'none'})
        }
    }
    variations[StatusPanelState.GLOBAL] = {
        'vertical': GlobalPanelConstructor(owner, variations.parentDiv.vertical)
    }

    /** @type {Element} */
    let currentMain
    /** @type {String} */
    let currentOrientation

    return {
        get showState() { return showState },
        setShowState(value) {
            if (value === showState) {
                console.warn('additional state show for some reason: ' + value)
                return
            }
            variations[value][currentOrientation].hide()
            showState = value
            variations[showState][currentOrientation].show()
        },
        onOrientationChange: (orientation) => {
            currentOrientation = orientation
            currentMain = variations.parentDiv.vertical
            // current = variations.parentDiv[orientation]
            currentMain.style.display = 'block'
            // variations.parentDiv[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }
}