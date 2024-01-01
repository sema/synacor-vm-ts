
export class Opcode {
    mnemonic!: string;
    size!: number;
}

export let opcodes: Opcode[] = [
    { 
        // opcode 0
        // stop execution and terminate the program
        mnemonic: "halt",
        size: 1,
    },
    { 
        // opcode 1
        // set register <a> to the value of <b>
        mnemonic: "set",
        size: 3,
    },
    { 
        // opcode 2
        // push <a> onto the stack
        mnemonic: "push",
        size: 2,
    },
    { 
        // opcode 3
        // pop the top element from the stack and write it into <a>; empty stack = error
        mnemonic: "pop",
        size: 2,
    },
    { 
        // opcode 4
        // set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
        mnemonic: "eq",
        size: 4,
    },
    { 
        // opcode 5
        // set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
        mnemonic: "gt",
        size: 4,
    },
    { 
        // opcode 6
        // jump to <a>
        mnemonic: "jmp",
        size: 2,
    },
    { 
        // opcode 7
        // if <a> is nonzero, jump to <b>
        mnemonic: "jt",
        size: 3,
    },
    { 
        // opcode 8
        // if <a> is zero, jump to <b>
        mnemonic: "jf",
        size: 3,
    },
    { 
        // opcode 9
        // assign into <a> the sum of <b> and <c> (modulo 32768)
        mnemonic: "add",
        size: 4,
    },
    { 
        // opcode 10
        // store into <a> the product of <b> and <c> (modulo 32768)
        mnemonic: "mult",
        size: 4,
    },
    { 
        // opcode 11
        // store into <a> the remainder of <b> divided by <c>
        mnemonic: "mod",
        size: 4,
    },
    { 
        // opcode 12
        // stores into <a> the bitwise and of <b> and <c>
        mnemonic: "and",
        size: 4,
    },
    { 
        // opcode 13
        // stores into <a> the bitwise or of <b> and <c>
        mnemonic: "or",
        size: 4,
    },
    { 
        // opcode 14
        // stores 15-bit bitwise inverse of <b> in <a>
        mnemonic: "not",
        size: 3,
    },
    { 
        // opcode 15
        // read memory at address <b> and write it to <a>
        mnemonic: "rmem",
        size: 3,
    },
    { 
        // opcode 16
        // write the value from <b> into memory at address <a>
        mnemonic: "wmem",
        size: 3,
    },
    { 
        // opcode 17
        // write the address of the next instruction to the stack and jump to <a>
        mnemonic: "call",
        size: 2,
    },
    { 
        // opcode 18
        // remove the top element from the stack and jump to it; empty stack = halt
        mnemonic: "ret",
        size: 1,
    },
    { 
        // opcode 19
        // write the character represented by ascii code <a> to the terminal
        mnemonic: "out",
        size: 2,
    },
    { 
        // opcode 20
        // read a character from the terminal and write its ascii code to <a>; it can be assumed that once input starts, it will continue until a newline is encountered; this means that you can safely read whole lines from the keyboard instead of having to figure out how to read individual characters
        mnemonic: "in",
        size: 2,
    },
    { 
        // opcode 21
        // no operation
        mnemonic: "noop",
        size: 1,
    },
]