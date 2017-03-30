import {PointerInputConstructor} from "./PointerInput";
import {IntersectorConstructor} from "./Intersector";

export const Input = {
    SessionInputTarget: { CANVAS: 'canvas' }
}

export const InputConstructor = (canvasDom, camera) => {
    const pointer = PointerInputConstructor(canvasDom)
    const intersector = IntersectorConstructor(camera)

    return {
        get pointer() { return pointer },
        get intersector() { return intersector }
    }
}