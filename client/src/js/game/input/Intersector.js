
export const IntersectorConstructor = (camera) => {

    const raycaster = new THREE.Raycaster()
    const pointerVec = new THREE.Vector2()

    return {
        test: (objects, pointer, domElement) => {
            pointerVec.x = (pointer.x / domElement.width) * 2 - 1
            pointerVec.y = -(pointer.y / domElement.height) * 2 + 1
            // console.log(pointerVec, objects)

            raycaster.setFromCamera(pointerVec, camera)

            const result = raycaster.intersectObjects(objects)
            // console.log(result)
            if (result.length > 0) {
                // console.log(result[0].object.material.color.setHex(0xFF0000))
            }
        }
    }
}