import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './HexagonGrid'
import {InputConstructor, Input} from "./input/Input";
import {Commands} from "./command/Commands";
import {ESConstructor} from "./es/ES";
import {CONST} from "../util/const";

export const SessionConstructor = (rawSessionData) => {
    let f = window.facade

    const data = SessionDataConstructor()
    const input = InputConstructor(f.renderer.domObject, f.renderer.camera)
    const es = ESConstructor(null, f.renderer.update)

    let baseLocation = Number.NaN
    let model = null
    let grid = null
    let cmd = null

    const _gameUpdater = () => {
        requestAnimationFrame(_gameUpdater)

        // check input
        if (input.pointer.target === Input.SessionInputTarget.CANVAS && input.pointer.wasMove) {
            const projVector = new THREE.Vector3(((input.pointer.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
            grid.rotate(Math.atan2(projVector.x, 0.5))
        }
        if (input.pointer.lastClick.click) {
            // console.time('intersection')
            input.intersector.test(grid.children, input.pointer.lastClick, f.renderer.domObject)
            // console.timeEnd('intersection')
            if (input.intersector.anySelected) {
                const selectedComponent = input.intersector.selection
                const hexIndex = selectedComponent.getNeighbour('logic').index
                const p = selectedComponent.mesh.position
                console.log(hexIndex, Math.atan2(p.z, p.x) * CONST.MATH.RAD_TO_DEG,
                    grid.utils.angleFromIndex(hexIndex) * CONST.MATH.RAD_TO_DEG)
            }
        }
        input.update() // update will nullify dx

        // check uplink

        // update game logic
        es.update()
    }

    const _gameTurn = () => {
        f.connection.turnHook(data.token, data.turn).then((commands) => {
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
        f.connection.token, 
        rawSessionData.session_token,
        rawSessionData.users
    )
    cmd = Commands(f.connection, data, es)
    // f.connection.traceState()
    // data.traceState()

    f.connection.ready(data.token).then(() => {
        //
        // load game params
        f.resourceLoader.load('assets/game_params.json').then((params) => {
            //
            // create game model
            model = GameModelConstructor(params)
            f.resourceLoader.load('assets/map_11_6.json').then((mapData) => {

                //
                // create visual grid
                grid = HexagonGridConstructor(mapData)
                es.add('grid', grid)

                //
                // determine self start location (tile-wise)
                // start location tiles is coded with '1' tile type
                let myStartLocation = -1
                if (f.connection.isOnline) {
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
                    .cmd('structure_add', 'base', 'base')
                    .data('location', myStartLocation)
                cmd.serializer
                    .add()
                    .cmd('unit_add', 'ork', 'ork1')
                    .data('location', myStartLocation+1)
                cmd.serializer
                    .add()
                    .cmd('unit_add', 'ork', 'ork2')
                    .data('location', myStartLocation-1)
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