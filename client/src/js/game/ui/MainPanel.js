import {UIUtils} from "./UIUtils";
export const StatusPanelState = {
    GLOBAL: 'GLOBAL',
    SELECTOR: 'SELECTOR',
    TILE: 'TILE',
    STRUCTURE: 'STRUCTURE',
    UNIT: 'UNIT'
}

/**
 * @param owner
 * @return {{showState, onOrientationChange: (function(*)), update: (function())}}
 * @constructor
 */
export const MainPanelConstructor = (owner) => {

    let showState = StatusPanelState.GLOBAL

    const variations = {
        'horizontal': UIUtils.createElement('div', 'uiMainPanelHorizontal', owner.root),
        'vertical': UIUtils.createElement('div', 'uiMainPanelVertical', owner.root)
    }

    /** @type {Element} */
    let current

    return {
        get showState() { return showState },
        onOrientationChange: (orientation) => {
            current = variations[orientation]
            current.style.display = 'block'
            variations[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }
}