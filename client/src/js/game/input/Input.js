import {PointerInputConstructor} from "./PointerInput";
import {IntersectorConstructor} from "./Intersector";

export const Input = {
    SessionInputTarget: { CANVAS: 'canvas' }
}

export const InputConstructor = (grid, canvasDom, camera) => {
    const pointer = PointerInputConstructor(canvasDom)
    const intersector = IntersectorConstructor(camera)

    return {
        update: () => {
            if (pointer.target === Input.SessionInputTarget.CANVAS && pointer.wasMove) {
                const projVector = new THREE.Vector3(((pointer.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
                grid.rotate(Math.atan2(projVector.x, 0.5))
            }
            if (pointer.lastClick.click) {
                intersector.test(grid.children, pointer.lastClick, canvasDom)
                if (intersector.anySelected) {
                    const hexIndex = intersector.selection
                    const comp = grid.getChild(hexIndex)
                    const logic = comp.getComponent('logic')
                    if (comp.getChildCount() > 0) {
                        let childrenStr = '['
                        for (let i = 0; i < comp.getChildCount(); i++) {
                            const child = comp.getChild(i)
                            childrenStr += child.name + ':' + child.type + '(' + child.possessor + ')'
                            if (i < comp.getChildCount()-1) {
                                childrenStr += ', '
                            }
                        }
                        childrenStr += ']'
                        console.info('#%i; %s; contains: %s',
                            hexIndex, logic.debugTemplate, childrenStr)
                    } else {
                        console.info('#%i; %s; EMPTY ',
                            hexIndex, logic.debugTemplate)
                    }
                }
            }

            pointer.cleanup()
        }
    }
}