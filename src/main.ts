import {parse} from './parse'
import {prettyPrint} from './prettyprinter'
import {interpret} from './interpreter'
import {Runtime} from './runtime'

if (process.argv.length != 4) {
    console.log("usage: <execute|prettyprint> <path-to-challenge.bin>")
    process.exit(1)
}
const command = process.argv[2]
const challenge_bin_path = process.argv[3]

let tokens = parse(challenge_bin_path)
console.log(`Parsed ${tokens.length} tokens from ${challenge_bin_path}`)

switch (command) {
case "execute":
    let runtime = new Runtime()
    interpret(runtime, tokens)
    break
case "prettyprint":
    prettyPrint(tokens)
    break
default:
    throw new Error("unknown command, expected either execute or prettyprint")
}
