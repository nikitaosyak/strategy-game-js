export const IntersectorConstructor = (utils) => {

    let selected = -1

    const raycaster = new THREE.Raycaster()

    return {
        /** @returns {boolean} */
        get anySelected() { return selected > -1 },
        /** @returns {Number} selected component index or -1 */
        get selection() { return selected },

        test: (objects, pointer) => {
            utils.pointerToRay(pointer, raycaster.ray)

            const result = raycaster.intersectObjects(objects, false)
            if (result.length > 0) {
                selected = result[0].injectedHexagonIndex
            } else {
                selected = -1
            }
        }
    }
}