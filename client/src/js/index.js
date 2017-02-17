import {FacadeConstructor} from './Facade'
import {HexagonConstructor} from './game/Hexagon'

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
    // connection made
}).catch(() => {
    // debug offline handle
})

const h = HexagonConstructor('someHex', 0, 'assets/models/hex_test')
h.loadVisual().then(() => {
    f.renderer.addObject(h.visual)
    f.renderer.renderBehaviour.add(() => {
        h.visual.rotation.y += 0.01
    })
})