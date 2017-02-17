import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoaderConstructor} from "./util/ResourceLoader";
import {ModelConstructor} from './game/Model'
import {ConnectionConstructor} from './Connection'

/**
 * @returns {{connection, model, renderer, resourceLoader}}
 * @constructor
 */
export const FacadeConstructor = () => {
    const _state = {
        resourceLoader: ResourceLoaderConstructor(),
        connection: ConnectionConstructor('localhost', 8181),
        model: ModelConstructor(),
        renderer: ThreeJsRendererConstructor()
    }

    return {
        get connection() { return _state.connection},
        get model() { return _state.model },
        get renderer() { return _state.renderer },
        get resourceLoader() { return _state.resourceLoader }
    }
}