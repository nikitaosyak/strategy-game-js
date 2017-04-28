import {GameEntityConstructor} from "../es/impl/GameEntity";
import {ThreejsComponentConstructor} from "../es/impl/ThreejsComponent";
export const CommandExecutor = (grid) => {

    const verbRouter = {
        create: (cmd) => {
            const entity = GameEntityConstructor(cmd.entity_name, cmd.entity_type, cmd.user_token)
            const visual = entity.addComponent('visual', ThreejsComponentConstructor('visual_' + cmd.entity_name))
            switch (cmd.entity_class) {
                case 'base':
                    visual.debugCube(0.3, 0.3, 0.3, new THREE.Color(1, 1, 1))
                    break
                case 'ork':
                    visual.debugCube(0.12, 0.12, 0.3, new THREE.Color(0.1, 0.8, 0.1))
                    break
                case 'human':
                    visual.debugCube(0.1, 0.1, 0.28, new THREE.Color(1, 0.8, 0.58))
                    break
                default:
                    throw 'Unknown entity class ' + cmd.entity_class
            }

            grid.getChild(cmd.location).addChild(entity)
        }
    }

    return {
        execute(commands) {
            if (commands === null || commands.length === 0) return
            commands.forEach(cmd => {
                console.log(JSON.stringify(commands))
                verbRouter[cmd.verb](cmd)
            })
        }
    }
}