import {HexagonConstructor} from './Hexagon'

const GridUtils = (template) => {

    const width = template.meta.width
    const height = template.meta.height
    const angleStep = 360 / width

    return {
        angleFromIndex: (index) => {
            const y = Math.floor(index/width)
            const x = index % width

            const angleDeg = -(x * angleStep) - (y * angleStep / 2)
            return angleDeg * Math.PI / 180
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

	f.renderer.addObject(_state.gridRoot)

    const facetWidth = 1 + template.meta.tileGap * 2
    const facetRadius = (facetWidth/2)/Math.sin(60 * Math.PI/180)
    const capHeight = facetRadius * Math.cos(60 * Math.PI/180)
    const rowOffset = facetRadius + capHeight
    const calculatedHeight = rowOffset * (template.meta.height-1)

	const radius = facetWidth / (2 * Math.tan(Math.PI / 11))
    f.renderer.camera.position.x = 20
    f.renderer.camera.position.y = 0
    f.renderer.camera.lookAt({x:0, y: 0, z:0})

    let centerY = calculatedHeight / 2

    for (let i = 0; i < template.layout.length; i++) {
	    const row = Math.floor(i/template.meta.width)
        const travelAngleRad = _state.utils.angleFromIndex(i)

        const x = radius * Math.cos(travelAngleRad)
        const z = radius * Math.sin(travelAngleRad)

        const hex = HexagonConstructor('hex' + i, i, template.layout[i], 'assets/models/hex_test')
        hex.loadVisual().then(() => {
            _state.grid[i] = hex

            hex.visual.gameIndex = i
            hex.visual.position.x = x
            hex.visual.position.y = centerY - row * rowOffset
            hex.visual.position.z = z
            hex.visual.rotation.y = Math.PI/2 - travelAngleRad
            _state.gridRoot.add(hex.visual)

            hex.init()
        })
    }

    return {
	    get children() { return _state.gridRoot.children },
        get utils() { return _state.utils },
        getHex: (index) => _state.grid[index],
	    rotate: (angle) => _state.gridRoot.rotation.y += angle,
        setAngle: (angle) => _state.gridRoot.rotation.y = angle
    }
}