
export const CommandSerializer = (sessionData) => {
    let commandList = null
    let commandListStringified = ''
    let currentIdx = Number.NaN
    let dirty = false
    const self = {
        begin() {
            dirty = true
            commandList = []
            commandListStringified = ''
            return self
        },
        add() {
            dirty = true
            commandList.push({})
            currentIdx = commandList.length-1

            commandList[currentIdx].user_token = sessionData.userToken
            commandList[currentIdx].turn = sessionData.turn
            return self
        },
        cmd(command, entityType, entityName) {
            dirty = true
            commandList[currentIdx].command = entityType + '_' + command
            commandList[currentIdx].entity_name = entityName
            return self
        },
        data(dataType, data) {
            dirty = true
            commandList[currentIdx][dataType] = data
            return self
        },
        getSerialized() {
            dirty = false
            commandListStringified = JSON.stringify(commandList)
            return commandListStringified
        },
        getRaw() { return commandList }
    }

    return self
}