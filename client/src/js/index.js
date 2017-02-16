import {FacadeConstructor} from './Facade'
import {HexagonConstructor} from './game/Hexagon'

//
// initialize game
const f = window.facade = FacadeConstructor()
f.getRender().init()
f.getRender().getCamera().position.z = 4

//
// load map layout here



const h = HexagonConstructor('someHex', 0)
h.loadVisual('assets/models/hex_test').then(() => {
    f.getRender().addObject(h.getVisual())
    f.getRender().renderBehaviour.add(() => {
        h.getVisual().rotation.y += 0.01
    })
})