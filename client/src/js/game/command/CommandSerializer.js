
export const CommandSerializer = (sessionData) => {
    let commandList = null
    let commandListSerialized = ''
    let currentIdx = Number.NaN
    let dirty = false

    const self = {
        begin() {
            dirty = true
            commandList = []
            commandListSerialized = ''
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
        cmd(verb, entityType, entityClass, entityName) {
            dirty = true
            commandList[currentIdx].verb = verb
            commandList[currentIdx].entity_type = entityType
            commandList[currentIdx].entity_class = entityClass
            commandList[currentIdx].entity_name = entityName
            return self
        },
        data(dataType, data) {
            dirty = true
            commandList[currentIdx][dataType] = data
            return self
        },
        getSerialized() {
            if (dirty) {
                dirty = false
                commandListSerialized = JSON.stringify(commandList)
            }
            return commandListSerialized
        },
        getRaw() { return commandList }
    }

    return self
}