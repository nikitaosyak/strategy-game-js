
export const elementShow = (state) => ({
    show: () => {
        state.element.style.display = 'none'
    }
})

export const elementHide = (state) => ({
    hide: () => {
        state.element.style.display = 'block'
    }
})