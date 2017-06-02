import {UIUtils} from "../UIUtils";

export const FullScreenButtonConstructor = (fullscreenElement, parent) => {

    let expand, collapse

    expand = UIUtils.createButtonElement(parent, './assets/ui/fullscreen_expand.png', () => {
        fullscreenElement.requestFullscreen()
        expand.style.display = 'none'
        collapse.style.display = 'block'
    })

    collapse = UIUtils.createButtonElement(parent, './assets/ui/fullscreen_collapse.png', () => {
        document.exitFullscreen()
        expand.style.display = 'block'
        collapse.style.display = 'none'
    }, {'display': 'none'})
}