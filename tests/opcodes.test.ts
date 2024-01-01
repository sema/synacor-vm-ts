import { opcodes } from '../src/opcodes';

describe('testing opcodes file', () => {
  test('opcodes are declared at the right index', () => {
    expect(opcodes[0].mnemonic).toBe("halt");
    expect(opcodes[1].mnemonic).toBe("set");
    expect(opcodes[2].mnemonic).toBe("push");
    expect(opcodes[3].mnemonic).toBe("pop");
    expect(opcodes[4].mnemonic).toBe("eq");
    expect(opcodes[5].mnemonic).toBe("gt");
    expect(opcodes[6].mnemonic).toBe("jmp");
    expect(opcodes[7].mnemonic).toBe("jt");
    expect(opcodes[8].mnemonic).toBe("jf");
    expect(opcodes[9].mnemonic).toBe("add");
    expect(opcodes[10].mnemonic).toBe("mult");
    expect(opcodes[11].mnemonic).toBe("mod");
    expect(opcodes[12].mnemonic).toBe("and");
    expect(opcodes[13].mnemonic).toBe("or");
    expect(opcodes[14].mnemonic).toBe("not");
    expect(opcodes[15].mnemonic).toBe("rmem");
    expect(opcodes[16].mnemonic).toBe("wmem");
    expect(opcodes[17].mnemonic).toBe("call");
    expect(opcodes[18].mnemonic).toBe("ret");
    expect(opcodes[19].mnemonic).toBe("out");
    expect(opcodes[20].mnemonic).toBe("in");
    expect(opcodes[21].mnemonic).toBe("noop");
  });
});
