
export const ThreeJsRendererConstructor = () => {
    let _canvasW = window.innerWidth, _canvasH = window.innerHeight

    const _scene = new THREE.Scene()
    const _camera = new THREE.PerspectiveCamera(16, _canvasW/_canvasH, 1, 1000)
    // const _camera = new THREE.OrthographicCamera( _canvasW / - 2, _canvasW / 2, _canvasH / 2, _canvasH / - 2, 1, 1000 );
    const _renderer = new THREE.WebGLRenderer()
    _renderer.setSize(_canvasW, _canvasH)
    _renderer.setClearColor(0x090040)
    _renderer.domElement.style.display = 'block'
    document.body.appendChild(_renderer.domElement)

    _scene.add(new THREE.AmbientLight(0x404040, 1.5))

    const _onWindowResize = () => {
        _canvasW = window.innerWidth
        _canvasH = window.innerHeight

        _renderer.setSize(_canvasW, _canvasH)
        _camera.aspect = _canvasW / _canvasH
        _camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', _onWindowResize, false)

    const self = {
        get camera() { return _camera },
        get domObject() { return _renderer.domElement },

        update: () => _renderer.render(_scene, _camera),

        getObjectByName: (name) => _scene.getObjectByName(name),
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