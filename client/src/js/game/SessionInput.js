export const SessionInputTarget = {
    CANVAS: 'canvas'
}

export const DeviceType = {
    COMPUTER: 'computer',
    MOBILE: 'mobile'
}

export const SessionInputConstructor = (canvas) => {
    const _state = {
        isDown: false,
        clickInfo: {click: false, x: 0, y: 0},
        target: null,
        downMove: false,
        downAnchor: {x: Number.NaN, y: Number.NaN},
        frameAnchor: {x: Number.NaN, y: Number.NaN},
        delta: {x: 0, y: 0}
    }

    const onTouchStart = (e, deviceType) => {
        e.preventDefault()

        _state.clickInfo.click = false
        _state.isDown = true
        _state.target = SessionInputTarget.CANVAS

        switch (deviceType) {
            case DeviceType.COMPUTER:
                _state.clickInfo.x = _state.downAnchor.x = _state.frameAnchor.x = e.clientX
                _state.clickInfo.y = _state.downAnchor.y = _state.frameAnchor.y = e.clientY
                break
            case DeviceType.MOBILE:
                _state.clickInfo.x = _state.downAnchor.x = _state.frameAnchor.x = e.touches.item(0).clientX
                _state.clickInfo.y = _state.downAnchor.y = _state.frameAnchor.y = e.touches.item(0).clientY
                break
            default:
                throw "Unknown device type: " + deviceType
        }
    }

    const onTouchMove = (e, deviceType) => {
        e.preventDefault()

        _state.downMove = _state.isDown
        switch (deviceType) {
            case DeviceType.COMPUTER:
                _state.frameAnchor.x = e.clientX
                _state.frameAnchor.y = e.clientY
                break
            case DeviceType.MOBILE:
                _state.frameAnchor.x = e.touches.item(0).clientX
                _state.frameAnchor.y = e.touches.item(0).clientY
                break
            default:
                throw "Unknown device type: " + deviceType
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

    canvas.ontouchstart = (e) => onTouchStart(e, DeviceType.MOBILE)
    canvas.ontouchmove = (e) => onTouchMove(e, DeviceType.MOBILE)
    canvas.ontouchend = onTouchEnd

    canvas.onmousedown = (e) => onTouchStart(e, DeviceType.COMPUTER)
    canvas.onmousemove = (e) => onTouchMove(e, DeviceType.COMPUTER)
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