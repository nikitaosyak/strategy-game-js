
export const IntersectorConstructor = (camera) => {

    const _state = {
        selected: Number.NaN
    }

    const raycaster = new THREE.Raycaster()
    const pointerVec = new THREE.Vector2()

    return {
        get anySelected() { return !Number.isNaN(_state.selected) },
        get selection() { return _state.selected },
        update: () => { _state.selected = Number.NaN },
        test: (objects, pointer, domElement) => {
            pointerVec.x = (pointer.x / domElement.width) * 2 - 1
            pointerVec.y = -(pointer.y / domElement.height) * 2 + 1
            // console.log(pointerVec, objects)

            raycaster.setFromCamera(pointerVec, camera)

            const result = raycaster.intersectObjects(objects)
            if (result.length > 0) {
                _state.selected = result[0].object.gameIndex
                // console.log(result[0].object.material.color.setHex(0xFF0000), result[0].object.gameIndex)
            } else {
                _state.selected = Number.NaN
            }
        }
    }
}