
export const ThreeJsRendererConstructor = () => {
    const w = window.innerWidth, h = window.innerHeight

    const _scene = new THREE.Scene()
    const _camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000)
    const _renderer = new THREE.WebGLRenderer()
    _renderer.setSize(w, h)
    document.body.appendChild(_renderer.domElement)

    const _renderBehaviours = []
    const _renderUpdate = () => {
        requestAnimationFrame(_renderUpdate)

        _renderBehaviours.forEach((rb) => rb())

        _renderer.render(_scene, _camera)
    }

    return {
        renderBehaviour: {
            add: (rb) => _renderBehaviours.push(rb),
            remove: (rb) => _renderBehaviours.splice(_renderBehaviours.indexOf(rb), 1),
            clearAll: () => _renderBehaviours.splice(0, _renderBehaviours.length)
        },
        getCamera: () => _camera,
        getObjectByName: (name) => _scene.getObjectByName(name),
        init: () => _renderUpdate(),
        addBox: (x, y, z, color, name) => {
            const m = new THREE.Mesh(
                new THREE.BoxGeometry(x, y, z),
                new THREE.MeshBasicMaterial({color: color})
            )
            m.name = name
            _scene.add(m)
        }
    }
}