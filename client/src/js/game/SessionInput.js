export const SessionInputTarget = {
    CANVAS: 'canvas'
}

export const SessionInputConstructor = (canvas) => {
    const _state = {
        isDown: false,
        clickInfo: {click: false, x: 0, y: 0},
        target: null,
        downMove: false,
        downAnchor: {x: Number.NaN, y: Number.NaN},
        frameAnchor: {x: Number.NaN, y: Number.NaN},
        delta: {x: 0, y: 0},
        frameDelta: {x: 0, y: 0}
    }

    const onTouchStart = (e, mobile) => {
        e.preventDefault()

        _state.clickInfo.click = false
        _state.isDown = true
        _state.target = SessionInputTarget.CANVAS

        if (mobile) {

            _state.clickInfo.x = _state.downAnchor.x = _state.frameAnchor.x = e.touches.item(0).clientX
            _state.clickInfo.y = _state.downAnchor.y = _state.frameAnchor.y = e.touches.item(0).clientY
        } else {
            _state.clickInfo.x = _state.downAnchor.x = _state.frameAnchor.x = e.clientX
            _state.clickInfo.y = _state.downAnchor.y = _state.frameAnchor.y = e.clientY
        }
    }

    const onTouchMove = (e, mobile) => {
        e.preventDefault()

        _state.downMove = _state.isDown
        if (mobile) {
            _state.frameAnchor.x = e.touches.item(0).clientX
            _state.frameAnchor.y = e.touches.item(0).clientY
        } else {
            _state.frameAnchor.x = e.clientX
            _state.frameAnchor.y = e.clientY
        }
        _state.delta.x = _state.frameAnchor.x - _state.downAnchor.x
        _state.delta.y = _state.downAnchor.y - _state.frameAnchor.y
    }

    const onTouchEnd = (e) => {
        e.preventDefault()

        _state.clickInfo.click = !_state.downMove
        _state.isDown = _state.downMove = false
        _state.target = null
    }

    canvas.ontouchstart = (e) => onTouchStart(e, true)
    canvas.ontouchmove = (e) => onTouchMove(e, true)
    canvas.ontouchend = onTouchEnd

    canvas.onmousedown = (e) => onTouchStart(e, false)
    canvas.onmousemove = (e) => onTouchMove(e, false)
    canvas.onmouseup = onTouchEnd

    return {
        get target() { return _state.target },
        get wasMove() { return _state.downMove },
        get lastClick() { return _state.clickInfo },
        get dx() { return _state.delta.x },
        get dy() { return _state.delta.y },

        deleteClick: () => _state.clickInfo.click = false,
        update: () => {
            _state.downAnchor.x = _state.frameAnchor.x
            _state.downAnchor.y = _state.frameAnchor.y
            _state.delta.x = _state.delta.y = 0

            // _state.frameAnchor.x = _state.frameAnchor.y = Number.NaN
        },
    }
}