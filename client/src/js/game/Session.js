import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './HexagonGrid'
import {SessionInputConstructor, SessionInputTarget} from "./SessionInput";

export const SessionConstructor = (sessionData) => {
    let f = window.facade
    const _state = {
        data: SessionDataConstructor(),
        input: SessionInputConstructor(f.renderer.domObject),
        model: null,
        grid: null
    }


    const _gameUpdater = () => {
        requestAnimationFrame(_gameUpdater)

        // check input
        _state.input.update()
        // console.log(_state.input.dx, _state.input.dy, _state.input.target)
        if (_state.input.target === SessionInputTarget.CANVAS) {

            const tt = new THREE.Vector3(((_state.input.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
            // console.log(_state.input.dx, tt.unproject(f.renderer.camera))

            // const dir = _state.input.dx < 0 ? -1 : 1
            // const projMatrix = f.renderer.camera.projectionMatrix.clone()
            // const worldToLocal = f.renderer.camera.matrixWorldInverse.clone()
            // const vpInverse = new THREE.Matrix4()
            // vpInverse.multiplyMatrices(worldToLocal, projMatrix)
            // vpInverse.getInverse(vpInverse, true)
            // const vec = new THREE.Vector3((Math.abs(_state.input.dx)/window.innerWidth) * 2 - 1)
            // vec.applyMatrix4(vpInverse)
            // console.log(vec.length(), _state.input.dx, vec)
            // if (dir > 0) {
            _state.grid.rotate(Math.atan2(tt.x, 0.5))
            // }
            // const vFOV = f.renderer.camera.fov * Math.PI / 180
            // const height = 2 * Math.tan(vFOV / 2) * f.renderer.camera.position.z
            // const aspect = window.width / window.height
            // _state.grid.rotate(_state.input.dx)
        }
        // _state.grid.rotateGrid(_state.input.get)

        // check uplink

        // update visual
        f.renderer.update()
    }
    
    //
    // create session data
    _state.data.initialize(
        f.connection.token, 
        sessionData.session_token, 
        sessionData.users
    )
    // f.connection.traceState()
    // _state.data.traceState()

    f.resourceLoader.load('assets/game_params.json').then((params) => {
        //
        // create game model
        _state.model = GameModelConstructor(params)
        f.resourceLoader.load('assets/map_11_6.json').then((mapData) => {

            //
            // create visual grid
            _state.grid = HexagonGridConstructor(mapData)

            //
            // determine self start location (tile-wise)
            // start location tiles is coded with '1' tile type
            let myStartLocation = -1
            if (f.connection.isOnline()) {
                let currentPointIndex = 0
                for (let i = 0; i < mapData.layout.length; i++) {
                    if (mapData.layout[i] !== 1) continue
                    if (_state.data.myIndex === currentPointIndex) {
                        myStartLocation = i
                        break
                    } else {
                        currentPointIndex += 1
                    }
                }
            } else {
                myStartLocation = 50 // we dont give a fuck in offline
            }
            console.log('session: my location: ' + myStartLocation)
            _gameUpdater()
        })      
    })
}