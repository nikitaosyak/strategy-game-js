import {GameModelConstructor} from './GameModel'
import {SessionDataConstructor} from './SessionData'

export const SessionConstructor = (f, sessionData) => {
	const _state = {
		session: SessionDataConstructor(),
		gameParams: null,
		mapParams: null
	}

	_state.session.initialize(
		f.connection.token, 
		sessionData.session_token, 
		sessionData.players
	)


}