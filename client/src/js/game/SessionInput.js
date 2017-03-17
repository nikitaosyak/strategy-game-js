
export const SessionInputConstructor = (canvas) => {
    const _state = {
        isDown: false,
        target: null,
        anchor: {x: Number.NaN, y: Number.NaN},
        frameAnchor: {x: Number.NaN, y: Number.NaN},
        delta: {x: Number.NaN, y: Number.NaN},
        digest: {target: null, dx: Number.NaN, dy: Number.NaN}
    }

    canvas.onmousedown = (e) => {
        // console.log(e)
        _state.isDown = true
        _state.target = 'canvas'

        _state.anchor.x = e.screenX
        _state.anchor.y = e.screenY
    }

    canvas.onmousemove = (e) => {
        if (!_state.isDown) return

        _state.delta.x = e.screenX - _state.anchor.x
        _state.delta.y = _state.anchor.y - e.screenY
        _state.frameAnchor.x = e.screenX
        _state.frameAnchor.y = e.screenY
    }

    canvas.onmouseup = (e) => {
        _state.isDown = false
        _state.target = null
        _state.delta.x = _state.delta.y
            = _state.anchor.x = _state.anchor.y
            = _state.frameAnchor.x = _state.frameAnchor.y = Number.NaN
    }

    return {
        calcState: () => {
            _state.digest.target = _state.target
            _state.digest.dx = _state.delta.x
            _state.digest.dy = _state.delta.y
            _state.anchor.x = _state.frameAnchor.x
            _state.anchor.y = _state.frameAnchor.y

            return _state.digest
        }
    }
}