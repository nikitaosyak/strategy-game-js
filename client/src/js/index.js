import {FacadeConstructor} from './Facade'
import {SessionConstructor} from './game/Session'

//
// initialize game
const f = window.facade = FacadeConstructor()
f.renderer.init()

f.connection.connect().then(
    () => {
        console.log('main: uplink estableashed. Token: %s', f.connection.token)
        f.connection.enqueue().then(
            SessionConstructor,
            () => {
                throw 'Retry queue not Implemented'
            })
    },
    () => {
        console.log('main: uplink not possible. starting OFFLINE mode')
        SessionConstructor({session_token:'DEADBEEF', users:['DEADBEEF']})
    })