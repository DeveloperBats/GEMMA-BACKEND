import chalk from "chalk"
import { ConsoleContructor } from "../interfaces"

class Console implements ConsoleContructor {
    constructor(private moduleName: String) {
        this.moduleName = moduleName
    }

    success(message: string, code: number) {
        console.log(
            `${chalk.bgGreen(
                `[${this.moduleName}][${code}](${new Date().toLocaleString()})`
            )}:${message}`
        )
    }

    error(message: string, code: number) {
        console.log(
            `${chalk.bgRed(
                `[${this.moduleName}][${code}](${new Date().toLocaleString()})`
            )}:${message}`
        )
    }

    debug(message: string) {
        console.log(
            `${chalk.bgBlue(
                `[${this.moduleName}](${new Date().toLocaleString()})`
            )}:${message}`
        )
    }
}

export default Console
