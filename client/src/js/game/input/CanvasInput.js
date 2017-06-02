import {PointerInputConstructor} from "./PointerInput";
import {IntersectorConstructor} from "./Intersector";
import {MainPanelState} from "../ui/MainPanel";

export const Input = {
    SessionInputTarget: { CANVAS: 'canvas' }
}

export const CanvasInput = (ui, grid, threeJSCamera) => {
    const pointer = PointerInputConstructor(ui.canvas)
    const intersector = IntersectorConstructor(threeJSCamera)

    return {
        update: () => {
            if (pointer.target === Input.SessionInputTarget.CANVAS && pointer.wasMove) {
                const projVector = new THREE.Vector3(((pointer.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
                grid.rotate(Math.atan2(projVector.x, 0.5))

            } else if (pointer.lastClick.click) {
                intersector.test(grid.children, pointer.lastClick, ui.canvas)
                if (intersector.anySelected) {
                    const hexIndex = intersector.selection
                    const hexagon = grid.getChild(hexIndex)
                    const logic = hexagon.getComponent('logic')

                    const numChildren = hexagon.getChildCount()
                    if (numChildren === 0) {
                        ui.main.setShowState(MainPanelState.TILE, hexagon)
                    } else {
                        if (numChildren === 1) {
                            ui.main.setShowState(MainPanelState.COMMAND, hexagon.getChild(0))
                        } else {
                            ui.main.setShowState(MainPanelState.SELECTOR, hexagon.getAllChildren())
                        }
                    }
                } else {
                    ui.main.setShowState(MainPanelState.GLOBAL)
                }
            }

            pointer.cleanup()
        }
    }
}