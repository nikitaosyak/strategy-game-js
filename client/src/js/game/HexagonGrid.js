import {HexagonConstructor} from './Hexagon'
import {
    entityAddChild, entityGetAnyChildren, entityGetChildren, entityGetName,
    entityUpdate
} from "./es/entityBehaviours";
import {EntityConstructor} from "./es/Entity";
import {CONST} from "../util/const";
import {ThreejsComponentConstructor} from "./es/impl/ThreejsComponent";

const GridUtils = (template) => {

    const width = template.meta.width
    const height = template.meta.height
    const angleStepDeg = CONST.CIRCLE_DEG / width

    return {
        angleFromIndex: (index) => {
            const y = Math.floor(index/width)
            const x = index % width

            const angleDeg = -(x * angleStepDeg) - (y * angleStepDeg / 2)
            return angleDeg * CONST.MATH.DEG_TO_RAD
        }
    }
}

export const HexagonGridConstructor = (template) => {
	let f = window.facade

	const _state = {
	    utils: GridUtils(template),
		template: template,
        gridRoot: new THREE.Object3D(),
		grid: []
	}

    const self = {
        get radius() { return radius },
        get children() { return _state.gridRoot.children },
        get utils() { return _state.utils },
        rotate: (angleRad) => _state.gridRoot.rotation.y += angleRad,
        setAngle: (angleRad) => _state.gridRoot.rotation.y = angleRad
    }

    Object.assign(self, entityGetName('HexagonGrid'))
    Object.assign(self, entityUpdate(new Map(), _state.grid))
    Object.assign(self, entityAddChild(_state.grid))
    Object.assign(self, entityGetAnyChildren(_state.grid))
    Object.assign(self, entityGetChildren(_state.grid))

	f.renderer.addObject(_state.gridRoot)

    const facetWidth = 1 + template.meta.tileGap * 2
    const facetRadius = (facetWidth/2)/Math.sin(CONST.HEX_ANGLE_DEG * CONST.MATH.DEG_TO_RAD)
    const capHeight = facetRadius * Math.cos(CONST.HEX_ANGLE_DEG * CONST.MATH.DEG_TO_RAD)
    const rowOffset = facetRadius + capHeight
    const calculatedHeight = rowOffset * (template.meta.height-1)

	const radius = facetWidth / (2 * Math.tan(Math.PI / template.meta.width))
    f.renderer.camera.position.x = 23
    f.renderer.camera.position.y = 0
    f.renderer.camera.lookAt({x:0, y: 0, z:0})

    let centerY = calculatedHeight / 2

    for (let i = 0; i < template.layout.length; i++) {
	    const row = Math.floor(i/template.meta.width)
        const travelAngleRad = _state.utils.angleFromIndex(i)

        const x = radius * Math.cos(travelAngleRad)
        const y = centerY - row * rowOffset
        const z = radius * Math.sin(travelAngleRad)
        const rotY = Math.PI/2 - travelAngleRad

        const hexEntity = EntityConstructor('entity_hex' + i)
        self.addChild(hexEntity)

        const logic = hexEntity.addComponent('logic', HexagonConstructor('logic_hex' + i, i, template.layout[i]))
        const visual = hexEntity.addComponent('visual', ThreejsComponentConstructor('visual_hex' + i))
        visual.loadParametrized('assets/models/hex_test', x, y, z, 0, rotY, 0, _state.gridRoot).then(logic.init)
    }

    return self
}