export class Runtime {
    pc!: number
    running!: boolean
    memory!: number[]
    registers!: number[]
    stack!: number[]
    stdoutBuffer!: string

    // functions interacting with the outside world, overwritten in tests
    stdoutLineWriter!: (data: string) => void
    stdinLineReader!: () => string

    constructor() {
        this.pc = 0;
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
