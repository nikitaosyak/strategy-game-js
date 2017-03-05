import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'

export const SessionConstructor = (f, sessionData) => {
    
    //
    // create session data
    const data = SessionDataConstructor()
    data.initialize(
        f.connection.token, 
        sessionData.session_token, 
        sessionData.users
    )
    // f.connection.traceState()
    // data.traceState()

    // create game model
    let model = null
    let myStartLocation = -1
    f.resourceLoader.load('assets/game_params.json').then((params) => {
        f.resourceLoader.load('assets/map_11_6.json').then((layout) => {
            layout = layout.layout
            
            //
            // determine self start location (tile-wise)
            // start location tiles is coded with '1' tile type
            if (f.connection.isOnline()) {
                let currentPointIndex = 0
                for (let i = 0; i < layout.length; i++) {
                    if (layout[i] !== 1) continue
                    if (data.myIndex === currentPointIndex) {
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

            model = GameModelConstructor(params, layout)
        })      
    })

    const _state = {
        data: data,
        model: model,
    }
}