
export const HexagonGridConstructor = (template) => {
	let f = window.facade

	const _state = {
		template: template,
		grid: []
	}

	const radius = template.meta.radius
	const angleStep = 360 / template.meta.tileWidth
	// const facetWidth = 2 * radius * 

// const h = HexagonConstructor('someHex', 0, 'assets/models/hex_test')
// h.loadVisual().then(() => {
//     f.renderer.addObject(h.visual)
//     f.renderer.renderBehaviour.add(() => {
//         h.visual.rotation.y += 0.01
//     })
// })

	// -- values we calculate
 //    local angle_step = 360 / facets
 //    local facet_w = 2 * radius * math.sin(math.rad(angle_step/2))
 //    data.map.visual_scale = facet_w
 //    local facet_radius = (facet_w/2)/math.sin(math.rad(60))
 //    local cap_height = (facet_radius * math.cos(math.rad(60)))
 //    local row_offset = facet_radius + cap_height


 //    local calculated_height = row_offset * (rows-1)
 //    local center_y = calculated_height/2
 //    print('game_controller: total_h: ' .. calculated_height .. '; center_y: ' .. center_y )

 //    local total = 0

 //    for j = 0, rows-1, 1 do
 //        for i = 0, facets-1, 1 do
 //            local center = vmath.vector3(0, center_y, 0)
 //            center.y = center.y - j * row_offset

 //            local travel_angle_deg = -(i * angle_step) - (j * angle_step / 2)
 //            local travel_angle = math.rad(travel_angle_deg)
 //            local x = radius * math.cos(travel_angle)
 //            local z = radius * math.sin(travel_angle)

 //            local facing_angle_deg = 90 - travel_angle_deg
 //            local facing_angle = math.rad(facing_angle_deg)

 //            local pos_data = {
 //                index = total+1,
 //                r = i,
 //                q = j,
 //                center = center,
 //                pos_cache = vmath.vector3(x + center.x, center.y, z + center.z),
 //                travel_angle = travel_angle_deg,
 //                facing_angle = facing_angle_deg,
 //                is_dirty = false
 //            }
 //            table.insert(data.map.position_state, total+1, pos_data)

 //            local geo_data = {
 //                template = self.map_data[total+1]
 //            }
 //            table.insert(data.map.state, total+1,
 //                {
 //                    is_dirty = false,
 //                    selection_state = -1,
 //                    geo = geo_data,
 //                    units_count = 0
 //                }
 //            )

 //            local obj_id = factory.create(
 //                '#factory',
 //                vmath.vector3(x + center.x, center.y, z + center.z),
 //                vmath.quat_rotation_y(facing_angle),
 //                { index = total+1 },
 //                vmath.vector3(data.map.visual_scale * (100 - data.map.visual_gap) / 100,
 //                              data.map.visual_scale * (100 - data.map.visual_gap) / 100,
 //                              data.map.visual_scale * (100 - data.map.visual_gap) / 100)
 //            )
 //            table.insert(data.objects, total+1, obj_id)
 //            total = total + 1
 //        end
 //    end
 //    print('game_controller: total tiles: ' .. total)
 //    data.objects_total = total
}