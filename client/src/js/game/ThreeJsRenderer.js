import {CONST} from "../util/const";
export const ThreeJsRendererConstructor = (canvasDom, gridHeight) => {
    let _canvasW = window.innerWidth, _canvasH = window.innerHeight

    const _scene = new THREE.Scene()

    const vFov = 16
    const _camera = new THREE.PerspectiveCamera(vFov, _canvasW/_canvasH, 1, 1000)
    const alpha = CONST.MATH.DEG_TO_RAD * (90 - vFov/2)
    console.log(gridHeight/2 * Math.tan(alpha))
    _camera.position.x = gridHeight/2 * Math.tan(alpha)
    _camera.position.y = 0
    _camera.lookAt({x:0, y: 0, z:0})

    const _renderer = new THREE.WebGLRenderer({
        canvas: canvasDom
    })
    _renderer.setSize(_canvasW, _canvasH)
    _renderer.setClearColor(0xF5F5CC)

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

        update: () => _renderer.render(_scene, _camera),

        addToScene: (value) => _scene.add(value),
        addBox: (x, y, z, color, name) => {
            const m = new THREE.Mesh(
                new THREE.BoxGeometry(x, y, z),
                new THREE.MeshBasicMaterial({color: color})
            )
            m.name = name
            self.addToScene(m)
        }
    }
    return self
}