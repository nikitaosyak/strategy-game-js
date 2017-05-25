import {FacadeConstructor} from './Facade'
import {SessionConstructor} from './game/Session'

window.onload = () => {
    const f = FacadeConstructor()

    f.connection.connect().then(
        () => {
            if (f.connection.isOnline) {
                console.info('uplink established. Token: %s', f.connection.token)
            } else {
                console.warn('uplink not possible. starting OFFLINE mode')
            }
            f.connection.enqueue().then(
                (sessionData) => SessionConstructor(f, sessionData),
                () => { throw 'Retry queue not Implemented' })
        },
        () => {
            console.info('uplink not possible. starting OFFLINE mode')
            SessionConstructor(f, {session_token:'DEADBEEF', users:['DEADBEEF']})
        })
}