
export const CommandExecutor = () => {

    const routeCommand = (value) => {

    }

    return {
        execute(commands) {
            if (commands === null || commands.length === 0) return
            commands.forEach(c => {
                console.log("Cmd.exec: %s:%s at turn %d", c.userToken, c.command, c.turn)
            })
        }
    }
}