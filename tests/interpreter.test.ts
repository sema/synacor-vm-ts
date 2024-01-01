import { interpret } from '../src/interpreter'
import { Runtime } from '../src/runtime'
import { registerOffset } from '../src/opcodes'

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

const reg0 = registerOffset + 0
const reg1 = registerOffset + 1
const reg2 = registerOffset + 2
const reg3 = registerOffset + 3
const reg4 = registerOffset + 4
const reg5 = registerOffset + 5
const reg6 = registerOffset + 6
const reg7 = registerOffset + 7

const reg0idx = 0
const reg1idx = 1
const reg2idx = 2
const reg3idx = 3
const reg4idx = 4
const reg5idx = 5
const reg6idx = 6
const reg7idx = 7

describe('testing interpreter output', () => {
  test('opCall jumps to target offset', () => {
    let world = new World()
    const tokens = [
        opCall, 3,       // 0: goto 3
        opHalt,          // 2: halt
        opSet, reg0, 10, // 3: reg0 = 10 
        opHalt,          // 6: halt
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(10)
  });
  test('opRet returns to call site after opCall', () => {
    let world = new World()
    const tokens = [
        opCall, 6,       // 0: goto 6
        opSet, reg1, 20, // 2: reg1 = 20
        opHalt,          // 5: halt
        opSet, reg0, 10, // 6: reg0 = 10 
        opRet,           // 9: return (to 2)
        opHalt,          // 10: halt
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(10)
    expect(world.runtime.registers[reg1idx]).toBe(20)
  });
  test('opRet halts if the stack is empty', () => {
    let world = new World()
    const tokens = [
        opRet
    ]
    interpret(world.runtime, tokens)
  });
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
  test('opAdd adds two numbers', () => {
    let world = new World()
    const tokens = [
        opAdd, reg0, 5, 10, // reg0 = 5 + 10
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(15)
  });
  test('opMult multiplies two numbers', () => {
    let world = new World()
    const tokens = [
        opMult, reg0, 5, 6, // reg0 = 5 * 6
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(30)
  });
  test('opMult resolves overflows by modulo', () => {
    let world = new World()
    const tokens = [
        opMult, reg0, 16768, 3,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(17536)
  });
  test('opMod calculates mod', () => {
    let world = new World()
    const tokens = [
        opMod, reg0, 10, 3,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(1)
  });
  test('opPush and opPop carries the value through', () => {
    let world = new World()
    const tokens = [
        opPush, 10,
        opPop, reg0,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(10)
  });
  test('opWmem and opRmem writes and reads back data from memory', () => {
    let world = new World()
    const tokens = [
        opWmem, 100, 20,   // mem[100] = 20
        opRmem, reg0, 100, // reg0 = mem[100]
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(20)
  });
  test('opAnd 0x011 & 0x011 = 0x011', () => {
    let world = new World()
    const tokens = [
        opAnd, reg0, 3, 3, // 3 = 0x011
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(3)
  });
  test('opAnd 0x110 & 0x101 = 0x100', () => {
    let world = new World()
    const tokens = [
        opAnd, reg0, 6, 5,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(4)
  });
  test('opOr 0x000 & 0x000 = 0x000', () => {
    let world = new World()
    const tokens = [
        opOr, reg0, 0, 0,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0)
  });
  test('opOr 0x010 & 0x001 = 0x011', () => {
    let world = new World()
    const tokens = [
        opOr, reg0, 2, 1,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(3)
  });
  test('opNot flips all zero bits in the first 15 bits', () => {
    let world = new World()
    const tokens = [
        opNot, reg0, 0b000000000000000,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0b111111111111111)
  });
  test('opNot flips all high bits in the first 15 bits', () => {
    let world = new World()
    const tokens = [
        opNot, reg0, 0b111111111111111,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0b000000000000000)
  });
  test('opAdd overflow is resolved using modulo register-offset', () => {
    let world = new World()
    const tokens = [
        opAdd, reg0, 32758, 15,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(5)
  });
  test('opEq sets reg0 to 1 if args are equal', () => {
    let world = new World()
    const tokens = [
        opEq, reg0, 15, 15,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(1)
  });
  test('opEq sets reg0 to 0 if args are not equal', () => {
    let world = new World()
    const tokens = [
        opEq, reg0, 15, 25,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0)
  });
  test('opGt sets reg0 to 1 if arg1 is larger than arg2', () => {
    let world = new World()
    const tokens = [
        opGt, reg0, 20, 10,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(1)
  });
  test('opGt sets reg0 to 0 if arg1 is equal to arg2', () => {
    let world = new World()
    const tokens = [
        opGt, reg0, 15, 15,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0)
  });
  test('opGt sets reg0 to 0 if arg1 is lesser than arg2', () => {
    let world = new World()
    const tokens = [
        opGt, reg0, 15, 25,
        opHalt,
    ]
    interpret(world.runtime, tokens)

    expect(world.runtime.registers[reg0idx]).toBe(0)
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