
export const elementShow = (state) => ({
    show: () => {
        if (state.active) return

        state.element.style.display = 'block'
        state.active = true
        state.invalidateView()
    }
})

export const elementHide = (state) => ({
    hide: () => {
        state.active = false
        state.context = null
        state.element.style.display = 'none'
    }
})

export const contextInject = (state) => ({
    injectContext: (value) => {
        state.context = value
        state.invalidateView()
    }
})