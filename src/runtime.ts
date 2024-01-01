import { Mutex } from 'async-mutex'
import { createInterface } from 'readline/promises'

export class Runtime {
    pc!: number
    running!: boolean
    memory!: number[]
    registers!: number[]
    stack!: number[]
    stdoutBuffer!: string
    stdinBuffer!: string

    // functions interacting with the outside world, overwritten in tests
    stdoutLineWriter!: (data: string) => void
    stdinLineReader!: () => Promise<string>

    constructor(tokens: number[]) {
        this.pc = 0;
        this.running = true;
        this.memory = Array<number>(2^15)
        this.registers = Array<number>(8)
        this.stack = Array<number>()
        this.stdoutBuffer = ""
        this.stdinBuffer = ""
        this.stdoutLineWriter = console.info
        this.stdinLineReader = async () => {
            let reader = createInterface({
                input: process.stdin,
            })
            const answer = await reader.question("")
            return answer + "\n"
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
        tokens.forEach((value, idx) => {
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

    async stdinNextChar(): Promise<string> {
        if (this.stdinBuffer == "") {
            this.stdinBuffer = await this.stdinLineReader()
        }

        const nextChar = this.stdinBuffer[0]
        this.stdinBuffer = this.stdinBuffer.substring(1, this.stdinBuffer.length)
        return nextChar
    }
}
