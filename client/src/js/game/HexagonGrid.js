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
    f.renderer.getCamera().position.y = 0
    f.renderer.getCamera().position.z = 20
    f.renderer.getCamera().lookAt({x:0, y: 0, z:0})
    const angleStep = 360 / template.meta.width

    let centerY = calculatedHeight / 2
    for (let j = 0; j < template.meta.height; j++) {
        for (let i = 0; i < template.meta.width; i++) {
	        const travelAngle = -(i * angleStep) - (j * angleStep / 2)
            const travelAngleRad = travelAngle * Math.PI / 180

            const x = radius * Math.cos(travelAngleRad)
            const z = radius * Math.sin(travelAngleRad)

            // console.log(travelAngle, travelAngle - 90)
            const hex = HexagonConstructor('hex' + i, i, 'assets/models/hex_test')
            hex.loadVisual().then(() => {
                hex.visual.position.x = x
                hex.visual.position.y = centerY - j * rowOffset
                hex.visual.position.z = z
                hex.visual.rotation.y = Math.PI/2 - travelAngleRad
                _state.gridRoot.add(hex.visual)
            })
        }
    }
}