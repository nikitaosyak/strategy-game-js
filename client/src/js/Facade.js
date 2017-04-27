import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoaderConstructor} from "./util/ResourceLoader";
import {ConnectionConstructor} from './Connection'

/**
 * @returns {{connection, renderer, resourceLoader}}
 * @constructor
 */
export const FacadeConstructor = () => {
    const resourceLoader = ResourceLoaderConstructor()
    const connection = ConnectionConstructor('localhost', 8181)
    const renderer = ThreeJsRendererConstructor()

    return {
        get connection() { return connection},
        get renderer() { return renderer },
        get resourceLoader() { return resourceLoader }
    }
}