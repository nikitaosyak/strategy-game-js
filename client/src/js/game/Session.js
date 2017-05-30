import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './es/impl/HexagonGrid'
import {CanvasInput} from "./input/CanvasInput";
import {Commands} from "./command/Commands";
import {ESConstructor} from "./es/ES";
import {UIConstructor} from "./ui/UI";
import {ThreeJsRendererConstructor} from "./ThreeJsRenderer";

export const SessionConstructor = (connection, rawSessionData) => {

    const resourceLoader = window.resourceLoader
    const ui = UIConstructor()

    const data = SessionDataConstructor()
    const es = ESConstructor(null, null)
    const renderer = ThreeJsRendererConstructor(ui.canvas)

    let baseLocation = Number.NaN
    let input = null
    let model = null
    let grid = null
    let cmd = null

    /**
     * main game loop
     * @private
     */
    const _gameUpdater = () => {
        requestAnimationFrame(_gameUpdater)

        ui.update()
        input.update()

        es.update()
        renderer.update()
    }

    const _gameTurn = () => {
        connection.turnHook(data.token, data.turn).then((commands) => {
            cmd.performRemote(commands)
            data.addTurn()
            _gameTurn()
        },
        (reason) => {
            throw 'Session.gameTurn: unable to complete turn! ' + reason
        })
    }
    
    //
    // create session data
    data.initialize(
        connection.token,
        rawSessionData.session_token,
        rawSessionData.users
    )
    // connection.traceState()
    // data.traceState()

    connection.ready(data.token).then(() => {
        //
        // load game params
        resourceLoader.load('assets/game_params.json').then((params) => {
            //
            // create game model
            model = GameModelConstructor(params)
            resourceLoader.load('assets/map_11_6.json').then((mapData) => {

                //
                // initialize services and dependencies
                grid = HexagonGridConstructor(mapData)
                input = CanvasInput(ui, grid, renderer.camera)
                renderer.addToScene(grid.visualRoot)

                es.add('grid', grid)
                cmd = Commands(connection, data, grid)
                ui.inject(es, cmd)

                //
                // determine self start location (tile-wise)
                // start location tiles is coded with '1' tile type
                let myStartLocation = -1
                if (connection.isOnline) {
                    let currentPointIndex = 0
                    for (let i = 0; i < mapData.layout.length; i++) {
                        if (mapData.layout[i] !== 1) continue
                        if (data.myIndex === currentPointIndex) {
                            myStartLocation = i
                            break
                        } else {
                            currentPointIndex += 1
                        }
                    }
                } else {
                    for (let i = 0; i < mapData.layout.length; i++) {
                        if (mapData.layout[i] !== 1) continue
                        myStartLocation = i// we dont give a fuck in offline
                        break
                    }
                }
                console.info('starting location: ' + myStartLocation)
                baseLocation = myStartLocation

                //
                // rotate grid root so our start location is
                // looking directly at the camera
                grid.setAngle(grid.utils.angleFromIndex(myStartLocation))

                //
                //
                cmd.serializer
                    .begin()
                    .add()
                    .cmd('create', 'structure', 'base', 'pohui')
                    .data('location', myStartLocation)
                cmd.serializer
                    .add()
                    .cmd('create', 'unit', 'ork', 'вася')
                    .data('location', myStartLocation+1)
                cmd.serializer
                    .add()
                    .cmd('create', 'unit', 'human', 'коля')
                    .data('location', myStartLocation-1)
                cmd.serializer
                    .add()
                    .cmd('create', 'unit', 'human', 'петя')
                    .data('location', myStartLocation-1)
                // cmd.serializer
                //     .add()
                //     .cmd('create', 'unit', 'ork', 'димон')
                //     .data('location', myStartLocation-1)
                // cmd.serializer
                //     .add()
                //     .cmd('create', 'unit', 'human', 'серега')
                //     .data('location', myStartLocation-1)
                // cmd.serializer
                //     .add()
                //     .cmd('create', 'unit', 'ork', 'фандорин')
                //     .data('location', myStartLocation-1)
                cmd.performLocal()

                _gameUpdater()
                _gameTurn()
            })
        })
    },
    (reason) => {
        console.log('Session: could not get ready: ' + reason)
    })
}