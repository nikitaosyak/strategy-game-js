import {PointerInputConstructor} from "./PointerInput";
import {IntersectorConstructor} from "./Intersector";
import {MainPanelState} from "../ui/MainPanel";

export const Input = {
    SessionInputTarget: { CANVAS: 'canvas' }
}

export const CanvasInput = (ui, grid, threeJSCamera) => {

    const utils = {
        domElement: ui.canvas,
        camera: threeJSCamera,
        pointerToRay: (screenPointer, ray) => {
            ray.origin.setFromMatrixPosition( utils.camera.matrixWorld )
            ray.direction.set(
                    ((screenPointer.x * window.devicePixelRatio) / utils.domElement.width) * 2 - 1,
                    -((screenPointer.y * window.devicePixelRatio) / utils.domElement.height) * 2 + 1,
                    0.5
                )
                .unproject( utils.camera )
                .sub( ray.origin ).normalize()
        }
    }

    const pointer = PointerInputConstructor(utils)
    const intersector = IntersectorConstructor(utils)

    const raycaster = new THREE.Raycaster()
    const anchorRay = new THREE.Ray()
    const currentRay = new THREE.Ray()
    let anchorAngle = Number.NaN
    let anchorRotation = 0

    return {
        update: () => {
            if (pointer.isDown) {
                if (anchorRay.origin.lengthSq() === 0) {
                    anchorRotation = grid.currentAngle
                    raycaster.ray = anchorRay
                    utils.pointerToRay(pointer.clickInfo, anchorRay)
                    const result = raycaster.intersectObjects(grid.children, false)
                    if (result && result.length > 0) {
                        // anchorAngle = result[0].point
                        anchorAngle = Math.atan2(result[0].point.x, result[0].point.z)
                    }
                }
            } else {
                anchorRay.origin.set(0, 0, 0)
                anchorRay.direction.set(0, 0, 0)
                anchorAngle = Number.NaN
            }
            if (pointer.target === Input.SessionInputTarget.CANVAS && pointer.wasMove) {
                raycaster.ray = currentRay
                utils.pointerToRay(pointer.frameAnchor, currentRay)
                const result = raycaster.intersectObjects(grid.children, false)
                if (result && result.length > 0 && !Number.isNaN(anchorAngle)) {
                    const currentAngle = Math.atan2(result[0].point.x, result[0].point.z)
                    grid.setAngle(anchorRotation + (currentAngle - anchorAngle))
                }
            } else if (pointer.clickInfo.click) {
                intersector.test(grid.children, pointer.clickInfo)
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