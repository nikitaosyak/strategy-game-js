import {UIUtils} from "../UIUtils";
export const CancelButtonConstructor = (cancelAction, parent) => {
    UIUtils.createButtonElement(parent, './assets/ui/cancel.png', cancelAction)
}
