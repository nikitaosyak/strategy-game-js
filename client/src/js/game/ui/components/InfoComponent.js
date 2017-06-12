import {UIUtils} from "../UIUtils";
export const InfoComponentConstructor = (localId, parent) => {

    const divElement = UIUtils.createElement('div', localId, parent, null, 'infoComponentDiv')
    const p1 = UIUtils.createElement('p', '', divElement, null, 'infoComponentDivContent')
    const p2 = UIUtils.createElement('p', '', divElement, null, 'infoComponentDivContent')
    const p3 = UIUtils.createElement('p', '', divElement, null, 'infoComponentDivContent')

    return {
        setInfo: (value1 = null, value2 = null, value3 = null) => {
            p1.innerHTML = value1
            p2.innerHTML = value2
            p3.innerHTML = value3
        }
    }
}