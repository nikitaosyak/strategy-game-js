/**
 * @param owner
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {ButtonConstructor} from "./components/Button";
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

    ButtonConstructor(variations.parentDiv.vertical, './assets/ui/fullscreen_expand.png', () => console.log('kek'))
    ButtonConstructor(variations.parentDiv.vertical, './assets/ui/fullscreen_expand.png', () => console.log('brekekek'))

    /** @type {Element} */
    let current

    return {
        get showState() { return showState },
        onOrientationChange: (orientation) => {
            current = variations.parentDiv[orientation]
            current.style.display = 'block'
            variations.parentDiv[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }
}