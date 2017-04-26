
export const ESConstructor = (renderer) => {
    const entities = new Map()

    return {
        add: (key, value) => entities.set(key, value),
        get: (key) => entities[key],
        update: () => {
            //
            // update game entities
            entities.forEach(e => {
                if ('update' in e) {
                    e.update()
                }
            })

            //
            // display game logic update
            renderer.update()
        },
        remove: (key) => entities.remove(key)
    }
}