import {
    entityAddComponent, entityChildCount, entityGetChild, entityGetComponent, entityGetName,
    entityUpdate
} from "../entityBehaviours";

export const HexagonEntity = (name) => {

    const state = {
        name: name,
        components: new Map(),
        children: []
    }

    let visual = null
    const cacheVisual = () => {
        if (visual === null || visual === 'undefined') {
            visual = self.getComponent('visual')
        }
    }

    const repositionChildren = () => {
        let angleIndex = 0
        state.children.forEach(ch => {

            //
            // properly ground child to hexagon base
            const childMesh = ch.getComponent('visual').mesh
            const childHeight = childMesh.geometry.boundingBox.max.z - childMesh.geometry.boundingBox.min.z
            childMesh.position.z = childHeight/2

            if (ch.template.type === 'unit') {
                const offsetX = 0.38 * Math.cos(Math.PI * 0.33 * angleIndex)
                const offsetY = 0.38 * Math.sin(Math.PI * 0.33 * angleIndex)
                childMesh.position.x = offsetX
                childMesh.position.y = offsetY
                angleIndex += 1
            }

        })
    }

    const self = {
        //
        // entity overrides
        addChild(value) {
            state.children.push(value)

            cacheVisual()
            visual.queryLoadDone().then(() => {
                const childMesh = value.getComponent('visual').mesh
                visual.mesh.add(childMesh)
                repositionChildren()
            })
        },
        removeChild(index) {
            cacheVisual()
            visual.queryLoadDone().then(() => {
                const childMesh = state.children[index].getComponent('visual').mesh
                visual.mesh.remove(childMesh)
                repositionChildren()
            })
            state.children.splice(index, 1)
        },

        getAllChildren() {
            return state.children
        },

        //
        // tree.js raycast helper
        raycast(raycaster, intersects) {
            cacheVisual()
            const beforeCast = intersects.length
            visual.mesh.raycast(raycaster, intersects)

            //
            // inject self index to intersect object to determine mesh linking
            const afterCast = intersects.length
            if (afterCast > beforeCast) {
                intersects[afterCast - 1].injectedHexagonIndex = self.getComponent('logic').index
            }
        }
    }

    Object.assign(self, entityGetName(state))
    Object.assign(self, entityUpdate(state))
    Object.assign(self, entityChildCount(state))
    Object.assign(self, entityGetChild(state))
    Object.assign(self, entityAddComponent(self, state))
    Object.assign(self, entityGetComponent(state))

    return self
}