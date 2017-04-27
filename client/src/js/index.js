import {FacadeConstructor} from './Facade'
import {SessionConstructor} from './game/Session'

const f = window.facade = FacadeConstructor()

f.connection.connect().then(
    () => {
        if (f.connection.isOnline) {
            console.info('uplink established. Token: %s', f.connection.token)
        } else {
            console.warn('uplink not possible. starting OFFLINE mode')
        }
        f.connection.enqueue().then(
            SessionConstructor,
            () => {
                throw 'Retry queue not Implemented'
            })
    },
    () => {
        console.info('uplink not possible. starting OFFLINE mode')
        SessionConstructor({session_token:'DEADBEEF', users:['DEADBEEF']})
    })