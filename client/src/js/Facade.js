import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";
import {ResourceLoader} from "./util/ResourceLoader";
import {ModelConstructor} from './game/Model'

export const FacadeConstructor = () => {
    const _model = ModelConstructor()
    const _render = ThreeJsRendererConstructor()
    const _loader = ResourceLoader()
    return {
        getModel: () => _model,
        getRender: () => _render,
        loadResource: (path) => _loader.loadResource(path),
    }
}