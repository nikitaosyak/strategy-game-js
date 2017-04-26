
export const intersectSelectionTest = (state) => {
    const _raycaster = new THREE.Raycaster()
    const _vectorPointer = new THREE.Vector2()
    return {
        test: (objects, pointer, domElement) => {
            _vectorPointer.x = (pointer.x / domElement.width) * 2 - 1
            _vectorPointer.y = -(pointer.y / domElement.height) * 2 + 1

            _raycaster.setFromCamera(_vectorPointer, state.camera)

            const result = _raycaster.intersectObjects(objects)
            if (result.length > 0) {
                state.selected = result[0].object.esComponent
            } else {
                state.selected = null
            }
        }
    }
}

export const debugTraceState = (state) => ({traceState: () => {console.log(JSON.stringify(state))}})