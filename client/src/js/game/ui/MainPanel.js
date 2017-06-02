/**
 * @param owner
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {FullScreenButtonConstructor} from "./components/FullscreenButton";
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
    }

    FullScreenButtonConstructor(owner.fullscreenElement, variations.parentDiv.vertical)

    /** @type {Element} */
    let current

    return {
        get showState() { return showState },
        setShowState(value) {
            showState = value
        },
        onOrientationChange: (orientation) => {
            current = variations.parentDiv.vertical
            // current = variations.parentDiv[orientation]
            current.style.display = 'block'
            // variations.parentDiv[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }
}