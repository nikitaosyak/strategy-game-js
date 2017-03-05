import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoaderConstructor} from "./util/ResourceLoader";
import {ConnectionConstructor} from './Connection'

/**
 * @returns {{connection, renderer, resourceLoader}}
 * @constructor
 */
export const FacadeConstructor = () => {
    const _state = {
        resourceLoader: ResourceLoaderConstructor(),
        connection: ConnectionConstructor('localhost', 8181),
        renderer: ThreeJsRendererConstructor()
    }

    return {
        get connection() { return _state.connection},
        get renderer() { return _state.renderer },
        get resourceLoader() { return _state.resourceLoader }
    }
}