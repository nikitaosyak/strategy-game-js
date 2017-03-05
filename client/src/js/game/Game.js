import {SessionConstructor} from './Session'

export const GameConstructor = (f, sessionData) => {
	const _state = {
		session: SessionConstructor()
	}

	_state.session.initialize(
		f.connection.token, 
		sessionData.session_token, 
		sessionData.players
	)
}