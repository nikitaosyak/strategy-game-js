
export const GameModelConstructor = (params, mapLayout) => {
	const _state = {
		params: params,
		mapLayout: mapLayout
	}

    return {
    	get params() { return _state.params },
    	get mapLayout() { return _state.mapLayout }
    }
}