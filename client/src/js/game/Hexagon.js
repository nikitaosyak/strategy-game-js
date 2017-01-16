
const HexagonConstructor = (name, index, visualPath) => {
    let _state = {
        name: name,
        index: index,
        visualPath: visualPath,
        visual: null
    }

    console.log('hexagon created: ', _state)

    return Object.assign(
        {},
        nameGetter(_state),
        indexGetter(_state),
        visualGetter(_state),

        visualLoader(_state)
    )
}