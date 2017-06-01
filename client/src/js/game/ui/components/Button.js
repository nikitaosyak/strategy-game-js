import {UIUtils} from "../UIUtils";
export const ButtonConstructor = (parent, icon, onclick) => {

    const btn = UIUtils.createElement('button', '', parent, {background : 'url('+icon+') no-repeat'}, 'button')
    btn.addEventListener('click', e => {
        onclick()
    })
}