export class Runtime {
    pc!: number

    // program contains the tokens defining the program.
    // The program is also loaded into memory starting at index 0.
    // The sample program overwrites parts of the program. It is unclear 
    // if the intention is to execute the original program or the modified
    // program. For now we keep the program and memory separate.
    program!: number[]
    running!: boolean
    memory!: number[]
    registers!: number[]
    stack!: number[]
    stdoutBuffer!: string

    // functions interacting with the outside world, overwritten in tests
    stdoutLineWriter!: (data: string) => void
    stdinLineReader!: () => string

    constructor(tokens: number[]) {
        this.pc = 0;
        this.program = tokens
        this.running = true;
        this.memory = Array<number>(2^15)
        this.registers = Array<number>(8)
        this.stack = Array<number>()
        this.stdoutBuffer = ""
        this.stdoutLineWriter = console.info
        this.stdinLineReader = () => {
            throw new Error("stdin reader not implemented")
        }

        // zero all registers
        for (let i = 0; i < 8; i++) {
            this.registers[i] = 0
        }

        // zero all memory
        for (let i = 0; i < (2**15); i++) {
            this.memory[i] = 0
        }
        // copy program into memory
        this.program.forEach((value, idx) => {
            this.memory[idx] = value
        })
    }

    // stdout accumulates output until we encounter a newline and then 
    // flushes the entire line to stdout. We expect `stdout` to be called
    // once for every character.
    stdout(data: string) {
        this.stdoutBuffer = this.stdoutBuffer + data
        if (data.endsWith("\n")) {
            // remove trailing \n
            this.stdoutBuffer = this.stdoutBuffer.substring(0, this.stdoutBuffer.length-1)

            // flush buffer
            this.stdoutLineWriter(this.stdoutBuffer)
            this.stdoutBuffer = ""
        }
    }
}
