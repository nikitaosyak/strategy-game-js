import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'

export const SessionConstructor = (f, sessionData) => {
    
    const data = SessionDataConstructor()
    data.initialize(
        f.connection.token, 
        sessionData.session_token, 
        sessionData.users
    )
    // f.connection.traceState()
    // data.traceState()

    let model = null
    f.resourceLoader.load('assets/game_params.json').then((data) => {
        const params = data
        f.resourceLoader.load('assets/map_11_6.json').then((data) => {
            const mapParams = data.layout
            model = GameModelConstructor(params, mapParams)
        })      
    })

    const _state = {
        data: data,
        model: model,
    }
}