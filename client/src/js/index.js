import {FacadeConstructor} from './Facade'
import {HexagonConstructor} from './game/Hexagon'
import {SessionConstructor} from './game/Session'

//
// initialize game
const f = window.facade = FacadeConstructor()
f.renderer.init()
f.renderer.getCamera().position.z = 4

//
// initialize connection with server
f.connection.connect().then(() => {
    // connection made, waiting session begin
    console.log('main: uplink estableashed. Token: %s', f.connection.token)
    f.connection.enqueue().then((sessionData) => {
        // game starting here
        console.log('main: session linked')
        SessionConstructor(sessionData)
    }, () => { throw 'Cannot enqueue' })
}, () => {
    // game starts in offline mode
    SessionConstructor(f, 
        {session_token:'DEADBEEF', users:['DEADBEEF']}
        )
})