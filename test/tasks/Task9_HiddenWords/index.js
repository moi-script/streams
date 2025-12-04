
import { createReadStream } from 'fs';
import { Writable } from 'stream';
import fs from 'fs';
// 1. Create a Custom Transform Stream That Censors Bad Words
// Input: a text file containing sentences
// Output: a version where banned words are replaced with "***"
// Requirements:
// Use a custom Transform stream
// Handle partial word splits across chunk boundaries


class ConfigStream extends Writable {
    constructor(path, wordConstraint, options) {
        super({ ...options });
        this.path = path;
        this.wordConstraint = wordConstraint;
        this.count = 0;
    }

    // replace *** wordContents
    checkContents(words) {
        return words.map(w =>
            this.wordConstraint.includes(w) ? "***" : w
        );
    }


    // cannot handle the backpressure manually 
    _write(chunk, encoding, cb) {
        console.log('Test');
        const wordContents = chunk.toString().split(" ");
        try {
            const mappedContents = this.checkContents(wordContents);
            this.count++;
            fs.writeFileSync(this.path, mappedContents.join(' ') + this.count);
            cb();
        } catch (err) {
            console.error(err);
            cb(err);
        }

    }
}
const input = process.argv[2];


const constraints = [
    "idiot",
    "stupid",
    "dumb",
    "mess",
    "nasty",
    "pointless",
    "jerk",
    "rude",
    "damn",
    "annoying"]

try {
    console.log('This is the input ;:', input);
    createReadStream(input).pipe(new ConfigStream('output.txt', constraints));
} catch (err) {
    console.error(err);
} 
