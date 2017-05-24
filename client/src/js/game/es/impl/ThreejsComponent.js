import {componentGetName, componentGetNeighbour, componentInjectOwner} from "../componentBehaviours";
import {debugTraceState} from "../../../util/behaviours";

export const ThreejsComponentConstructor = (name) => {

    const state = {
        name: name,
        loaded: false,
        mesh: null
    }

    const loadCallbackCache = []
    const resolveLoadCallbackCache = () => {
        loadCallbackCache.forEach(cb => cb())
        loadCallbackCache.splice(0, loadCallbackCache.length)
    }

    const self = {
        get isLoaded() { return state.loaded },
        get mesh() {return state.mesh},
        queryLoadDone: () => promiseLoad,
        debugCube: (sizex, sizey, sizez, color) => {
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(sizex, sizey, sizez),
                new THREE.MeshBasicMaterial({color: color})
            )
            cube.geometry.computeBoundingBox()

            state.loaded = true
            state.mesh = cube
            cube.esComponent = self
            resolveLoadCallbackCache()
        },
        loadParametrized: (path, x = 0, y = 0, z = 0, rotX = 0, rotY = 0, rotZ = 0, parent = null) => {
            return new Promise((resolve, reject) => {
                self.load(path).then(() => {
                    state.mesh.position.x = x
                    state.mesh.position.y = y
                    state.mesh.position.z = z
                    state.mesh.rotation.x = rotX
                    state.mesh.rotation.y = rotY
                    state.mesh.rotation.z = rotZ
                    if (parent !== null) {
                        parent.add(state.mesh)
                    }
                    resolve()
                    resolveLoadCallbackCache()
                }, () => { reject(); resolveLoadCallbackCache() })
            })
        },
        load: (path) => {
            return new Promise((resolve, reject) => {
                const meshPath = path + '.obj'
                const texturePath = path + '_tex.png'

                const f = window.facade
                f.resourceLoader.load(texturePath).then((texture) => {
                    f.resourceLoader.load(meshPath).then((obj) => {
                        obj.traverse(child => {
                            if (child instanceof THREE.Mesh) {
                                state.loaded = true
                                state.mesh = child
                                child.material = new THREE.MeshPhongMaterial(
                                    {
                                        color: 0xff00ff,
                                        side: THREE.DoubleSide,
                                        map: texture
                                    }
                                )
                            }
                        })

                        if (state.loaded) {
                            resolve()
                        } else {
                            reject('Unable to find mesh child')
                        }
                        resolveLoadCallbackCache()

                    }, () => { reject(); resolveLoadCallbackCache() })
                }, () => { reject(); resolveLoadCallbackCache() })
            })
        }
    }

    const promiseLoad = new Promise((resolve, _) => {
        if (self.isLoaded) {
            resolve()
        } else {
            loadCallbackCache.push(resolve)
        }
    })

    Object.assign(self, componentGetName(state))
    Object.assign(self, componentInjectOwner(state))
    Object.assign(self, componentGetNeighbour(state))
    Object.assign(self, debugTraceState(state))

    return self
}