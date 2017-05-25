/**
 * Creates the god object with everything the game has in it
 * @constructor
 */
import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoaderConstructor} from "./util/ResourceLoader";
import {ConnectionConstructor} from './Connection'
import {UIConstructor} from "./ui/UI";

export const FacadeConstructor = () => {
    const ui = UIConstructor()
    const resourceLoader = ResourceLoaderConstructor()
    const connection = ConnectionConstructor('localhost', 8181)
    const renderer = ThreeJsRendererConstructor()

    window.resourceLoader = resourceLoader // don't know how else to inject that without pain

    return {
        get ui() { return ui },
        get resourceLoader() { return resourceLoader },
        get connection() { return connection},
        get renderer() { return renderer }
    }
}