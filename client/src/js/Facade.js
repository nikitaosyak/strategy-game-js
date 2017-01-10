import {ThreeJsRendererConstructor} from "./render/ThreeJsRenderer";

const RendererType = {
    THREE_JS: ThreeJsRendererConstructor
}

const FacadeConstructor = () => {
    const _model = ModelConstructor()
    const _render = RendererType.THREE_JS()
    return {
        getModel: () => _model,
        getRender: () => _render
    }
}