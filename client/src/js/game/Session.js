import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './HexagonGrid'
import {SessionInputConstructor} from "./SessionInput";

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
        console.log(_state.input.calcState())
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