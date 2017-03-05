
export const GameModelConstructor = (params) => {
	const _state = {
		params: params
	}

    return {
    	get params() { return _state.params }
    }
}