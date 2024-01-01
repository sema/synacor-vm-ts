import { opcodes, registerOffset } from './opcodes'

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

export function formatInstruction(pc: number, tokens: number[]): string {
    const opcodeIndex = tokens[pc]
    const opcode = opcodes[opcodeIndex]
    let args: string[] = Array<string>()
    for (let offset = 1; offset < opcode.size; offset++) {
        let token = tokens[pc + offset]
        args.push(formatValue(token))
    }

    return `${pc} ${opcode.mnemonic} ${args.join(" ")}`
}

function formatValue(token: number): string {
    if (token < registerOffset) {
        return token.toString()  // literal
    } else if (token < (registerOffset + 8)) {
        return `r${token - registerOffset}` // register
    }

    throw new Error(`invalid literal ${token}`)
}
