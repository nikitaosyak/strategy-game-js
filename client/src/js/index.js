import {FacadeConstructor} from './Facade'
import {HexagonConstructor} from './game/Hexagon'
import {GameConstructor} from './game/Game'

//
// initialize game
const f = window.facade = FacadeConstructor()
f.renderer.init()
f.renderer.getCamera().position.z = 4

//
// load map layout here

//
// initialize connection with server
f.connection.connect().then(() => {
    // connection made, waiting session begin
    console.log('main: uplink estableashed. Token: %s', f.connection.token)
    f.connection.enqueue().then((sessionData) => {
        // game starting here
        console.log('main: session linked')
        GameConstructor(f, sessionData)
    }, () => { throw 'Cannot enqueue' })
}, () => console.log('main: running in offline mode'))

// const h = HexagonConstructor('someHex', 0, 'assets/models/hex_test')
// h.loadVisual().then(() => {
//     f.renderer.addObject(h.visual)
//     f.renderer.renderBehaviour.add(() => {
//         h.visual.rotation.y += 0.01
//     })
// })