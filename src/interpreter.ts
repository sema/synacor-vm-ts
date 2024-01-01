import { opcodes } from './opcodes'
import { Runtime } from './runtime'
import { formatInstruction } from './prettyprinter'

export function interpret(runtime: Runtime, tokens: number[], trace?: boolean) {
    while (runtime.running) {
        const opcodeIndex = tokens[runtime.pc]
        if (opcodeIndex == undefined) {
            throw new Error(`pc is out of bounds, missing halt operation?`)
        }
        const opcode = opcodes[opcodeIndex]
        if (opcode == undefined) {
            throw new Error(`could not find upcode with index ${opcodeIndex}`)
        }

        if (opcode.impl == undefined) {
            throw new Error(`unimplemented opcode "${opcode.mnemonic}"`)
        }

        if (trace) {
            console.log(formatInstruction(runtime.pc, tokens, runtime))
        }

        opcode.impl(runtime, tokens)
    }
}
