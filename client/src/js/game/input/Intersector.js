export const IntersectorConstructor = (camera) => {

    let selected = -1

    const raycaster = new THREE.Raycaster()
    const vectorPointer = new THREE.Vector2()

    return {
        /** @returns {boolean} */
        get anySelected() { return selected > -1 },
        /** @returns {Number} selected component index or -1 */
        get selection() { return selected },

        test: (objects, pointer, domElement) => {
            vectorPointer.x = (pointer.x / domElement.width) * 2 - 1
            vectorPointer.y = -(pointer.y / domElement.height) * 2 + 1

            raycaster.setFromCamera(vectorPointer, camera)

            const result = raycaster.intersectObjects(objects, false)
            if (result.length > 0) {
                selected = result[0].injectedHexagonIndex
            } else {
                selected = -1
            }
        }
    }
}