import {SessionConstructor} from './game/Session'
import {ConnectionConstructor} from "./Connection";
import {ResourceLoaderConstructor} from "./util/ResourceLoader";

window.onload = () => {
    window.resourceLoader = ResourceLoaderConstructor() // don't know how else to inject that without pain

    const connection = ConnectionConstructor('localhost', 8181)

    connection.connect().then(
        () => {
            if (connection.isOnline) {
                console.info('uplink established. Token: %s', connection.token)
            } else {
                console.warn('uplink not possible. starting OFFLINE mode')
            }
            connection.enqueue().then(
                (sessionData) => SessionConstructor(connection, sessionData),
                () => { throw 'Retry queue not Implemented' })
        },
        () => {
            console.info('uplink not possible. starting OFFLINE mode')
            SessionConstructor(connection, {session_token:'DEADBEEF', users:['DEADBEEF']})
        })
}