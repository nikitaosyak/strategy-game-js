import {HexagonConstructor} from './Hexagon'

export const HexagonGridConstructor = (template) => {
	let f = window.facade

	const _state = {
		template: template,
        gridRoot: new THREE.Object3D(),
		grid: []
	}

	f.renderer.addObject(_state.gridRoot)

    const facetWidth = 1 + template.meta.tileGap * 2
    const facetRadius = (facetWidth/2)/Math.sin(60 * Math.PI/180)
    const capHeight = facetRadius * Math.cos(60 * Math.PI/180)
    const rowOffset = facetRadius + capHeight
    const calculatedHeight = rowOffset * (template.meta.height-1)

	const radius = facetWidth / (2 * Math.tan(Math.PI / 11))
    f.renderer.camera.position.y = 0
    f.renderer.camera.position.z = 20
    f.renderer.camera.lookAt({x:0, y: 0, z:0})
    const angleStep = 360 / template.meta.width

    let centerY = calculatedHeight / 2

    for (let j = 0; j < template.meta.height; j++) {
        for (let i = 0; i < template.meta.width; i++) {
	        const travelAngle = -(i * angleStep) - (j * angleStep / 2)
            const travelAngleRad = travelAngle * Math.PI / 180

            const x = radius * Math.cos(travelAngleRad)
            const z = radius * Math.sin(travelAngleRad)

            const index = j * template.meta.width + i
            const hex = HexagonConstructor('hex' + index, index, 'assets/models/hex_test')
            hex.loadVisual().then(() => {
	            hex.visual.gameIndex = index
                hex.visual.position.x = x
                hex.visual.position.y = centerY - j * rowOffset
                hex.visual.position.z = z
                hex.visual.rotation.y = Math.PI/2 - travelAngleRad
                _state.gridRoot.add(hex.visual)
            })
        }
    }

    return {
	    get children() { return _state.gridRoot.children },
	    rotate: (angle) => {
	        // console.log(eulerAngle, Math.atan2(eulerAngle, 20) * 180/Math.PI)
	        _state.gridRoot.rotation.y += angle
        }
    }
}