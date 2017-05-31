import {CONST} from "../util/const";
export const ThreeJsRendererConstructor = (canvasDom, gridHeight) => {
    let canvasW, canvasH = 0
    const _scene = new THREE.Scene()

    const vFov = 16
    const _camera = new THREE.PerspectiveCamera(vFov, canvasW/canvasH, 1, 1000)
    const alpha = CONST.MATH.DEG_TO_RAD * (90 - vFov/2)
    _camera.position.x = gridHeight/2 * Math.tan(alpha)
    _camera.position.y = 0
    _camera.lookAt({x:0, y: 0, z:0})

    const _renderer = new THREE.WebGLRenderer({
        canvas: canvasDom
    })
    _renderer.setPixelRatio(window.devicePixelRatio)
    _renderer.setSize(canvasW, canvasH)
    _renderer.setClearColor(0xF5F5CC)

    _scene.add(new THREE.AmbientLight(0x404040, 1.5))

    const _onWindowResize = () => {
        canvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth)
        canvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight)
        console.log(window.devicePixelRatio, 'WINDOW RESIZE: ', canvasW, canvasH)

        _renderer.setSize(canvasW, canvasH)
        _camera.aspect = canvasW / canvasH
        _camera.updateProjectionMatrix()
    }
    // _onWindowResize()
    // window.addEventListener('resize', _onWindowResize, false)
    // document.addEventListener('fullscreenchange', e => {
    //     console.log(document.fullscreenElement, e)
    // })

    const self = {
        get camera() { return _camera },

        update: () => {
            const newCanvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth)
            const newCanvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight)
            if (newCanvasW !== canvasW || newCanvasH !== canvasH) {
                _onWindowResize()
            }
            _renderer.render(_scene, _camera)
        },

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