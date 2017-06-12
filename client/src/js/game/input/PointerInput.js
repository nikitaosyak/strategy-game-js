import {Input} from "./CanvasInput";

export const PointerInputConstructor = (utils) => {
    const state = {
        isDown: false,
        clickInfo: {click: false, x: 0, y: 0},
        target: null,
        downMove: false,
        frameAnchor: {x: Number.NaN, y: Number.NaN},
        frameCurrent: {x: Number.NaN, y: Number.NaN},
        delta: {x: 0, y: 0}
    }

    const onTouchStart = (e, deviceType) => {
        e.preventDefault()

        state.clickInfo.click = false
        state.isDown = true
        state.target = Input.SessionInputTarget.CANVAS

        switch (deviceType) {
            case 'computer':
                state.clickInfo.x = state.frameAnchor.x = state.frameCurrent.x = e.clientX
                state.clickInfo.y = state.frameAnchor.y = state.frameCurrent.y = e.clientY
                break
            case 'mobile':
                state.clickInfo.x = state.frameAnchor.x = state.frameCurrent.x = e.touches.item(0).clientX
                state.clickInfo.y = state.frameAnchor.y = state.frameCurrent.y = e.touches.item(0).clientY
                break
            default:
                throw "Unknown device type: " + deviceType
        }
    }

    const onTouchMove = (e, deviceType) => {
        e.preventDefault()

        switch (deviceType) {
            case 'computer':
                state.downMove = state.isDown
                state.frameCurrent.x = e.clientX
                state.frameCurrent.y = e.clientY
                break
            case 'mobile':
                state.frameCurrent.x = e.touches.item(0).clientX
                state.frameCurrent.y = e.touches.item(0).clientY
                if (!state.downMove) {
                    const dx = Math.abs(state.frameAnchor.x - state.frameCurrent.x)
                    const dy = Math.abs(state.frameAnchor.y - state.frameCurrent.y)
                    state.downMove = dx > 0.01 || dy > 0.01
                }
                break
            default:
                throw "Unknown device type: " + deviceType
        }
        state.delta.x = state.frameCurrent.x - state.frameAnchor.x
        state.delta.y = state.frameAnchor.y - state.frameCurrent.y
    }

    const onTouchEnd = (e) => {
        e.preventDefault()

        state.clickInfo.click = !state.downMove
        state.isDown = state.downMove = false
        state.target = null
    }

    utils.domElement.ontouchstart = (e) => onTouchStart(e, 'mobile')
    utils.domElement.ontouchmove = (e) => onTouchMove(e, 'mobile')
    utils.domElement.ontouchend = onTouchEnd

    utils.domElement.onmousedown = (e) => onTouchStart(e, 'computer')
    utils.domElement.onmousemove = (e) => onTouchMove(e, 'computer')
    utils.domElement.onmouseup = onTouchEnd

    return {
        get isDown() { return state.isDown },
        get target() { return state.target },
        get wasMove() { return state.downMove },
        get clickInfo() { return state.clickInfo },
        get frameAnchor() { return state.frameAnchor },
        get dx() { return state.delta.x },
        get dy() { return state.delta.y },

        cleanup: () => {
            state.frameAnchor.x = state.frameCurrent.x
            state.frameAnchor.y = state.frameCurrent.y
            state.delta.x = state.delta.y = 0

            state.clickInfo.click = false
        },
    }
}