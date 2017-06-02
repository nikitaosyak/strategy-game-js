import {CONST} from "../util/const";
export const ThreeJsRendererConstructor = (canvasDom, gridHeight) => {
    let canvasW, canvasH = 0

    const scene = new THREE.Scene()
    scene.add(new THREE.AmbientLight(0x404040, 1.5))

    const vFov = 16
    const camera = new THREE.PerspectiveCamera(vFov, canvasW/canvasH, 0.1, 1000)
    const alpha = CONST.MATH.DEG_TO_RAD * (90 - vFov/2)
    camera.position.x = gridHeight/2 * Math.tan(alpha)
    camera.position.y = 0
    camera.lookAt({x:0, y: 0, z:0})

    const renderer = new THREE.WebGLRenderer({ canvas: canvasDom })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0xF5F5CC)


    let orientation
    const resizeCanvas = () => {
        canvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth) * (orientation === 'horizontal' ? 0.7 : 1)
        canvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight) - (orientation === 'vertical' ? 60 : 0)

        renderer.setSize(canvasW, canvasH)
        camera.aspect = canvasW / canvasH
        camera.updateProjectionMatrix()
    }
    // document.addEventListener('fullscreenchange', e => {
    //     console.log(document.fullscreenElement, e)
    // })

    const self = {
        get camera() { return camera },
        get orientation() { return orientation },
        update: () => {
            const newCanvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth)
            const newCanvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight)
            let oldOrientation = orientation
            if (newCanvasW !== canvasW || newCanvasH !== canvasH) {
                orientation = newCanvasW < newCanvasH ? 'vertical' : 'horizontal'
                resizeCanvas()
            }
            renderer.render(scene, camera)

            return oldOrientation !== orientation
        },

        addToScene: (value) => scene.add(value),
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