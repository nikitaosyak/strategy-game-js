
export const visualLoader = (state) => ({loadVisual: () => {
        return new Promise((resolve, reject) => {
            const meshPath = state.visualPath + '.obj'
            const texturePath = state.visualPath + '_tex.png'

            const f = window.facade;
            f.resourceLoader.load(texturePath).then((texture) => {
                f.resourceLoader.load(meshPath).then((obj) => {
                    obj.traverse(child => {
                        if (child instanceof THREE.Mesh) {
                            state.visual = child
                            child.material = new THREE.MeshPhongMaterial(
                                {
                                    color: 0xff00ff,
                                    side: THREE.DoubleSide,
                                    map: texture
                                }
                            )
                        }
                    })
                    // console.log('someones visual loaded: ', state)
                    resolve()
                }, reject)
            }, reject)
        })
}})

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
                state.selected = result[0].object.gameIndex
            } else {
                state.selected = Number.NaN
            }
        }
    }
}