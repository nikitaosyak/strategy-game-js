
export const stateGetter = (state) => ({getState: () => state})

export const nameGetter = (state) => ({getName: () => state.name})
export const indexGetter = (state) => ({getIndex: () => state.index})
export const visualGetter = (state) => ({getVisual: () => state.visual})

export const visualLoader = (state) => ({loadVisual: (path) => {
        return new Promise((resolve, reject) => {
            const meshPath = path + '.obj'
            const texturePath = path + '_tex.png'

            const f = window.facade;
            f.loadResource(texturePath).then((texture) => {
                f.loadResource(meshPath).then((obj) => {
                    obj.traverse(child => {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshPhongMaterial(
                                {
                                    color: 0xffffff,
                                    side: THREE.DoubleSide,
                                    map: texture
                                }
                            )
                        }
                    })
                    state.visual = obj
                    console.log('someones visual loaded: ', state)
                    resolve()
                }).catch(reject)
            }).catch(reject)
        })
}})