import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './HexagonGrid'
import {InputConstructor, Input} from "./input/Input";

export const SessionConstructor = (sessionData) => {
    let f = window.facade
    const _state = {
        data: SessionDataConstructor(),
        input: InputConstructor(f.renderer.domObject, f.renderer.camera),
        model: null,
        grid: null
    }


    const _gameUpdater = () => {
        requestAnimationFrame(_gameUpdater)

        // check input
        if (_state.input.pointer.target === Input.SessionInputTarget.CANVAS && _state.input.pointer.wasMove) {
            const projVector = new THREE.Vector3(((_state.input.pointer.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
            _state.grid.rotate(Math.atan2(projVector.x, 0.40))
        }
        if (_state.input.pointer.lastClick.click) {
            // console.log(_state.input.pointer.lastClick)
            console.time('intersection')
            _state.input.intersector.test(_state.grid.children, _state.input.pointer.lastClick, f.renderer.domObject)
            console.timeEnd('intersection')
            _state.input.pointer.deleteClick()

        }
        _state.input.pointer.update() // update will nullify dx

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