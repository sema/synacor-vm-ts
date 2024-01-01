import { interpret } from '../src/interpreter'
import { Runtime } from '../src/runtime'

const opHalt = 0
const opSet = 1
const opPush = 2
const opPop = 3
const opEq = 4
const opGt = 5
const opJmp = 6
const opJt = 7
const opJf = 8
const opAdd = 9
const opMult = 10
const opMod = 11
const opAnd = 12
const opOr = 13
const opNot = 14
const opRmem = 15
const opWmem = 16
const opCall = 17
const opRet = 18
const opOut = 19
const opIn = 20
const opNoop = 21

describe('testing interpreter output', () => {
  test('opOut flushes literals when newline is encountered', () => {
    let world = new World()
    const tokens = [
        opOut, 70,  // print F
        opOut, 79,  // print O
        opOut, 79,  // print O
        opOut, 10,  // print \n
        opOut, 66,  // print B
        opOut, 65,  // print A
        opOut, 82,  // print R
        opOut, 10,  // print \n
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.stdoutBuffer).toBe("")
    expect(world.mockStdoutWriter.mock.calls).toHaveLength(2)
    expect(world.mockStdoutWriter.mock.calls[0][0]).toBe("FOO")
    expect(world.mockStdoutWriter.mock.calls[1][0]).toBe("BAR")
  });
});

class World {
    runtime!: Runtime

    mockStdoutWriter!: jest.Mock

    constructor() {
        this.mockStdoutWriter = jest.fn((data: string) => {})
        this.runtime = new Runtime()
        this.runtime.stdoutLineWriter = this.mockStdoutWriter
    }
}
