import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoader} from "./util/ResourceLoader";
import {ModelConstructor} from './game/Model'
import {Connection} from './Connection'

export const FacadeConstructor = () => {
    const _model = ModelConstructor()
    const _render = ThreeJsRendererConstructor()
    const _loader = ResourceLoader()
    const _connection = new Connection('localhost', 8181);

    return {
        getConnection: () => _connection,
        getModel: () => _model,
        getRender: () => _render,
        loadResource: (path) => _loader.loadResource(path),
    }
}