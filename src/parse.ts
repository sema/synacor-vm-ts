import {readFileSync} from 'node:fs'

export function parse(source: string): number[] {
    let buffer = readFileSync(source)
    assertFileHasExpectedLength(buffer)

    let result: number[] = []
    for (let pos = 0; pos < buffer.length; pos = pos + 2) {
        const lowerByte = buffer[pos]
        const higherByte = buffer[pos+1]

        let token = (higherByte << 8) + lowerByte
        result.push(token)

        assertTokenIsValid(pos, token)
    }

    return result
}

function assertFileHasExpectedLength(buffer: Buffer) {
    if (buffer.length % 2 != 0) {
        // TODO exceptions
        console.log("invalid format of bin: unexpected length")
        process.exit(1)
    }
}

function assertTokenIsValid(pos: number, token: number) {
    if (token >= 32776 || token < 0) {
        // TODO exceptions
        console.log(`invalid format of bin: unexpected token ${token} at position ${pos}`)
        process.exit(1)
    } 
}