export const UIUtils = {
    oppositeOrientation: {
        'vertical': 'horizontal',
        'horizontal': 'vertical'
    },

    /**
     * @param {string} tag
     * @param {string} id
     * @param {Element} parent
     * @param {*} styleParams
     * @param {string} cssClass
     * @return {Element}
     */
    createElement: (tag, id, parent = null, styleParams = null, cssClass = null) => {
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

        if (cssClass !== null && cssClass !== undefined) {
            el.className = cssClass
        }
        return el
    }
}