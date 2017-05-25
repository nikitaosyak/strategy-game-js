import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'
import {HexagonGridConstructor} from './es/impl/HexagonGrid'
import {InputConstructor, Input} from "./input/Input";
import {Commands} from "./command/Commands";
import {ESConstructor} from "./es/ES";

export const SessionConstructor = (facade, rawSessionData) => {
    const f = facade

    const data = SessionDataConstructor()
    const input = InputConstructor(f.renderer.domObject, f.renderer.camera)
    const es = ESConstructor(null, null)

    let baseLocation = Number.NaN
    let model = null
    let grid = null
    let cmd = null

    /**
     * main game loop
     * @private
     */
    const _gameUpdater = () => {
        requestAnimationFrame(_gameUpdater)

        // TODO: move this
        if (input.pointer.target === Input.SessionInputTarget.CANVAS && input.pointer.wasMove) {
            const projVector = new THREE.Vector3(((input.pointer.dx + window.innerWidth/2)/window.innerWidth) * 2 - 1, 0, 0.5)
            grid.rotate(Math.atan2(projVector.x, 0.5))
        }
        if (input.pointer.lastClick.click) {
            input.intersector.test(grid.children, input.pointer.lastClick, f.renderer.domObject)
            if (input.intersector.anySelected) {
                const hexIndex = input.intersector.selection
                const comp = grid.getChild(hexIndex)
                const logic = comp.getComponent('logic')
                if (comp.getChildCount() > 0) {
                    let childrenStr = '['
                    for (let i = 0; i < comp.getChildCount(); i++) {
                        const child = comp.getChild(i)
                        childrenStr += child.name + ':' + child.type + '(' + child.possessor + ')'
                        if (i < comp.getChildCount()-1) {
                            childrenStr += ', '
                        }
                    }
                    childrenStr += ']'
                    console.info('#%i; %s; contains: %s',
                        hexIndex, logic.debugTemplate, childrenStr)
                } else {
                    console.info('#%i; %s; EMPTY ',
                        hexIndex, logic.debugTemplate)
                }
            }
        }
        input.update()
        // TODO: check uplink here
        es.update()
        f.ui.update()
        f.renderer.update()
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
                f.renderer.addToScene(grid.visualRoot)
                es.add('grid', grid)
                cmd = Commands(f.connection, data, grid)

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