import {FacadeConstructor} from './Facade'
import {HexagonConstructor} from './game/Hexagon'
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

console.log("PREVED, lalka")
var f = FacadeConstructor()
f.getRender().init()
f.getRender().getCamera().position.z = 4

var h = HexagonConstructor('someHex', 0)
h.loadVisual('assets/models/hex_test').then(() => {
    f.getRender().addObject(h.getVisual())
    f.getRender().renderBehaviour.add(() => {
        h.getVisual().rotation.y += 0.01
    })
})