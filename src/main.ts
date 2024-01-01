import {parse} from './parse'
import {prettyPrint} from './prettyprinter'

if (process.argv.length != 3) {
    console.log("path to challenge.bin not provided")
    process.exit(1)
}
const challenge_bin_path = process.argv[2]

let tokens = parse(challenge_bin_path)
console.log(`Parsed ${tokens.length} tokens from ${challenge_bin_path}`)

prettyPrint(tokens)
