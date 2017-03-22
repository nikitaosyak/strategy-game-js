export const SessionInputTarget = {
    CANVAS: 'canvas'
}

export const SessionInputConstructor = (canvas) => {
    const _state = {
        isDown: false,
        target: null,
        downMove: false,
        downAnchor: {x: Number.NaN, y: Number.NaN},
        frameAnchor: {x: Number.NaN, y: Number.NaN},
        // framePosition: {x: Number.NaN, y: Number.NaN},
        delta: {x: 0, y: 0},
        frameDelta: {x: 0, y: 0}
    }

    canvas.ontouchstart = (e) => {
        // console.log(e.touches)
        _state.isDown = true
        _state.target = SessionInputTarget.CANVAS

        _state.downAnchor.x = _state.frameAnchor.x = e.touches.item(0).screenX
        _state.downAnchor.y = _state.frameAnchor.y = e.touches.item(0).screenY
    }

    canvas.ontouchmove = (e) => {
        _state.downMove = true
        _state.frameAnchor.x = e.touches.item(0).screenX
        _state.frameAnchor.y = e.touches.item(0).screenY
        _state.delta.x = _state.frameAnchor.x - _state.downAnchor.x
        _state.delta.y = _state.downAnchor.y - _state.frameAnchor.y
    }

    canvas.ontouchend = (e) => {
        _state.isDown = _state.downMove = false
        _state.target = null
    }

    canvas.onmousedown = (e) => {
        _state.isDown = true
        _state.target = SessionInputTarget.CANVAS

        _state.downAnchor.x = _state.frameAnchor.x = e.screenX
        _state.downAnchor.y = _state.frameAnchor.y = e.screenY
    }

    canvas.onmousemove = (e) => {
        _state.downMove = true
        _state.frameAnchor.x = e.screenX
        _state.frameAnchor.y = e.screenY
        _state.delta.x = _state.frameAnchor.x - _state.downAnchor.x
        _state.delta.y = _state.downAnchor.y - _state.frameAnchor.y
    }

    canvas.onmouseup = (e) => {
        _state.isDown = _state.downMove = false
        _state.target = null
        // _state.downAnchor.x = _state.downAnchor.y = Number.NaN
    }

    return {
        get target() { return _state.target },
        get wasMove() { return _state.downMove },
        get dx() { return _state.delta.x },
        get dy() { return _state.delta.y },
        update: () => {
            _state.downAnchor.x = _state.frameAnchor.x
            _state.downAnchor.y = _state.frameAnchor.y
            // _state.frameAnchor.x = _state.frameAnchor.y = Number.NaN
        }
    }
}