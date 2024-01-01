import { opcodes, registerOffset } from './opcodes'
import { Runtime } from './runtime'

export function prettyPrint(tokens: number[]) {
    let pc = 0
    
    while (pc < tokens.length) {
        const opcodeIndex = tokens[pc]
        if (opcodeIndex >= opcodes.length) {
            pc += 1
            continue
        }

        console.info(formatInstruction(pc, tokens))

        const opcode = opcodes[opcodeIndex]
        pc += opcode.size
    }

}

export function formatInstruction(pc: number, tokens: number[], runtime?: Runtime): string {
    const opcodeIndex = tokens[pc]
    const opcode = opcodes[opcodeIndex]
    let args: string[] = Array<string>()
    for (let offset = 1; offset < opcode.size; offset++) {
        let token = tokens[pc + offset]
        args.push(formatValue(token, runtime))
    }

    return `${pc} ${opcode.mnemonic} ${args.join(" ")}`
}

function formatValue(token: number, runtime?: Runtime): string {
    if (token < registerOffset) { // literal
        return token.toString()
    } else if (token < (registerOffset + 8)) { // register
        const registerIdx = token - registerOffset
        if (runtime != undefined) {
            return `r${registerIdx}<${runtime.registers[registerIdx]}>`
        }
        return `r${registerIdx}`
    }

    throw new Error(`invalid literal ${token}`)
}
