import {CommandSerializer} from "./CommandSerializer";
import {CommandExecutor} from "./CommandExecutor";

export const Commands = (connection, sessionData, es) => {
    const _serializer = CommandSerializer(sessionData)
    const _executor = CommandExecutor(es)

    return {
        get serializer() { return _serializer },
        performLocal() {
            _executor.execute(_serializer.getRaw())
            connection.sendCommand(sessionData.token, _serializer.getSerialized())
        },
        performRemote(commands) {
            _executor.execute(commands)
        }
    }
}