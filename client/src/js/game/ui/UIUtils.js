export const UIUtils = {
    /**
     * @param {string} tag
     * @param {string} id
     * @param {Element} parent
     * @param {*} styleParams
     * @return {Element}
     */
    createElement: (tag, id, parent = null, styleParams = null) => {
        const el = document.createElement(tag)
        el.id = id
        if (parent === null || parent === undefined) {
            document.getElementById('uiRoot').appendChild(el)
        } else {
            parent.appendChild(el)
        }

        if (styleParams !== null && styleParams !== undefined) {
            for (const key in styleParams) {
                el.style[key] = styleParams[key]
            }
        }
        return el
    }
}