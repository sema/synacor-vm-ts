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

const reg0 = 32768
const reg1 = 32769
const reg2 = 32770
const reg3 = 32771
const reg4 = 32772
const reg5 = 32773
const reg6 = 32774
const reg7 = 32775

const reg0idx = 0
const reg1idx = 1
const reg2idx = 2
const reg3idx = 3
const reg4idx = 4
const reg5idx = 5
const reg6idx = 6
const reg7idx = 7

describe('testing interpreter output', () => {
  test('opSet sets value for register 0', () => {
    let world = new World()
    const tokens = [
        opSet, reg0, 10,  // reg0 = 10
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(10)
  });
  test('opSet sets value for register 0', () => {
    let world = new World()
    const tokens = [
        opSet, reg7, 10,  // reg7 = 10
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg7idx]).toBe(10)
  });
  test('opJmp jumps to target program counter', () => {
    let world = new World()
    const tokens = [
        opJmp, 6,        // 0: goto 2
        opSet, reg0, 10, // 2: reg0 = 10
        opHalt,          // 5: halt 
        opSet, reg0, 20, // 6: reg0 = 20
        opHalt,          // 9: halt
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(20)
  });
  test('opJt jumps to target if arg0 is non-zero', () => {
    testConditionalJump(opJt, 10, true)
  });
  test('opJt skips arg0 is zero', () => {
    testConditionalJump(opJt, 0, false)
  });
  test('opJt jumps to target if reg0 is non-zero', () => {
    testConditionalRegisterJump(opJt, 10, true)
  });
  test('opJt skips reg0 is zero', () => {
    testConditionalRegisterJump(opJt, 0, false)
  });
  test('opJf jumps to target if arg0 is zero', () => {
    testConditionalJump(opJf, 0, true)
  });
  test('opJf skips arg0 is non-zero', () => {
    testConditionalJump(opJf, 10, false)
  });
  test('opJf jumps to target if reg0 is zero', () => {
    testConditionalRegisterJump(opJf, 0, true)
  });
  test('opJf skips reg0 is non-zero', () => {
    testConditionalRegisterJump(opJf, 10, false)
  });
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

function testConditionalJump(op: number, literal: number, expectJumped: boolean) {
  let world = new World()
    const tokens = [
        op, literal, 7,  // 0: goto 3 or 7
        opSet, reg0, 10, // 3: reg0 = 10
        opHalt,          // 6: halt 
        opSet, reg0, 20, // 7: reg0 = 20
        opHalt,          // 10: halt
    ]
    interpret(world.runtime, tokens)

    if (expectJumped) {
      expect(world.runtime.registers[reg0idx]).toBe(20)
    } else {
      expect(world.runtime.registers[reg0idx]).toBe(10)
    } 
}

function testConditionalRegisterJump(op: number, literal: number, expectJumped: boolean) {
  let world = new World()
    const tokens = [
        opSet, reg0, literal, // 0: reg0 = <literal>
        op, reg0, 10,          // 3: goto 6 or 10
        opSet, reg0, 10,      // 6: reg0 = 10
        opHalt,               // 9: halt 
        opSet, reg0, 20,      // 10: reg0 = 20
        opHalt,               // 13: halt
    ]
    interpret(world.runtime, tokens)

    if (expectJumped) {
      expect(world.runtime.registers[reg0idx]).toBe(20)
    } else {
      expect(world.runtime.registers[reg0idx]).toBe(10)
    } 
}