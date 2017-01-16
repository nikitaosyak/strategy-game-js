
export const ThreeJsRendererConstructor = () => {
    let _canvasW = window.innerWidth, _canvasH = window.innerHeight

    const _scene = new THREE.Scene()
    const _camera = new THREE.PerspectiveCamera(75, _canvasW/_canvasH, 0.1, 1000)
    const _renderer = new THREE.WebGLRenderer()
    _renderer.setSize(_canvasW, _canvasH)
    _renderer.domElement.style.display = 'block'
    document.body.appendChild(_renderer.domElement)

    _scene.add(new THREE.AmbientLight(0x404040, 1.5))

    const _renderBehaviours = []
    const _renderUpdate = () => {
        requestAnimationFrame(_renderUpdate)

        _renderBehaviours.forEach((rb) => rb())

        _renderer.render(_scene, _camera)
    }

    const _onWindowResize = () => {
        _canvasW = window.innerWidth
        _canvasH = window.innerHeight

        _renderer.setSize(_canvasW, _canvasH)
        _camera.aspect = _canvasW / _canvasH
        _camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', _onWindowResize, false)

    const self = {
        renderBehaviour: {
            add: (rb) => _renderBehaviours.push(rb),
            remove: (rb) => _renderBehaviours.splice(_renderBehaviours.indexOf(rb), 1),
            clearAll: () => _renderBehaviours.splice(0, _renderBehaviours.length)
        },
        getCamera: () => _camera,
        getObjectByName: (name) => _scene.getObjectByName(name),
        init: () => _renderUpdate(),
        addObject: (value) => _scene.add(value),
        addBox: (x, y, z, color, name) => {
            const m = new THREE.Mesh(
                new THREE.BoxGeometry(x, y, z),
                new THREE.MeshBasicMaterial({color: color})
            )
            m.name = name
            self.addObject(m)
        }
    }
    return self
}