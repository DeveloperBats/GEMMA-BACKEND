import chalk from "chalk"
import { ConsoleContructor } from "../interfaces"

class Console implements ConsoleContructor {
    constructor(private moduleName: String) {
        this.moduleName = moduleName
    }

    success(content: any, code: number) {
        console.log(
            `${chalk.bgGreen(
                `[${this.moduleName}][${code}](${new Date().toLocaleString()})`
            )}:`,
            content
        )
    }

    error(content: any, code: number) {
        console.log(
            `${chalk.bgRed(
                `[${this.moduleName}][${code}](${new Date().toLocaleString()})`
            )}:`,
            content
        )
    }

    debug(content: any) {
        console.log(
            `${chalk.bgBlue(
                `[${this.moduleName}](${new Date().toLocaleString()})`
            )}:`,
            content
        )
    }
}

export default Console
