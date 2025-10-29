

import Stream, { Readable, Writable, Transform, Duplex } from 'stream';
import Chance from 'chance';
import fs, { mkdir } from 'fs/promises';
import path, { extname } from 'path';
import { fileURLToPath } from 'url';
// -- The reason why we read a stream is to write it to writable

const chance = new Chance();

function delay() {
    return new Promise((acc) => setTimeout(() => acc(chance.string({ length: 15 })), 3000));
}
// const del = delay();


// del.then(val => console.log(val));

// by having stream class configuration, we can modified it as we want
// also having error handling
class NewStreams extends Readable {
    constructor(options) {
        super(options)
        this.switch = false;
    }

    async _read() { // this read method will loop until the null was push in internal
        this.push(await delay());
        this.switch = true;

        if (this.switch) {
            throw new Error("Switch was activated.");
        }
        this.push(null);
    }
}

// const streams = new NewStreams();

// testing stream events
// streams.on('data', chunks => console.log('The data was pushed :: ', chunks.toString()));
// streams.on('error', err => console.log('There was an error reading :: ', err));


// similarly to writable, however these two needs a source and destination, source for readable, and destination for write 
const writetable = new Writable({
    objectMode: true,
    write(chunks, encoding, cb) {
        console.log(chunks); //  // writetable.write('hello')
        cb()
    }
})

class TestReadableInstance extends Readable {
    constructor(options) {
        super(options);
    }

    _read() {
        this.push('Hello world');
        this.push(null);
    }

    print() {
        this.on('data', data => console.log(data.toString()));
    }

    active() {
        this.print();
    }
}


// const test = new TestReadableInstance();

// test.print();






// now lets test readable.pipe();

// readable and writable should be own configuration 


// the only confusing here is the object mode in writable
// when a readable pipe into a writable it was not an object but instead just a buffer;

// answer -> both readable and writable should both object mode
// however upon doing so, it may cause a highWaterMark | threshold
// const arsReadable = Readable.from([{message1 : 'hello'}, {message2 : 'world'}], {objectMode : true});




const testWritableInstance = new Writable({
    objectMode: true,
    write(chunks, encoding, cb) {
        // const chunksObject = chunks.toString();

        console.log('Chunks recieved value :: ', chunks);
        const projectFolder = new URL('./test', import.meta.url);
        const validFilePath = fileURLToPath(projectFolder);

        // test object mode
        // console.log("Object mode :: ", chunks.message);

        // create folder and file
        mkdir(projectFolder).then(() => fs.writeFile(path.join(validFilePath, 'newTXT.txt'), JSON.stringify(chunks))).then(() => cb()).catch(err => console.error(err))
    }
});

// might be better
const pipingReadStreamInstance = new Readable({
    objectMode: true,
    read() {
        // always string or buffer
        this.push(JSON.stringify([{ message1: 'hello' }, { message2: 'world' }]));
        this.push(null);
    }
})

// pipingReadStreamInstance.pipe(testWritableInstance);



// NEXT TO IMPLEMENT HERE IS DUPLEX AND TRANSFORM 

// -- DUPLEX can be both writable and readable -> meaning we can use both, .write() -> cb, 'data' event -> this.push()

// testWritableInstance.write({message : 'Hi there file'});

// const projectFolder = new URL( './test', import.meta.url);
//         console.log('Path created :: ', projectFolder);

// mkdir(projectFolder).then(() => fs.writeFile(path.join(fileURLToPath(projectFolder), 'testLol.txt'), 'hello world'));

// console.log('Valid file path :: ', fileURLToPath(projectFolder));


const searchStr = 'World' 
const replaceStr = 'Node.js'
let tail = ''

// Pieces 
// [ 'Hello W' ]
// [ 'lo WNode.js' ]

// Last pieces
// Hello W
// lo WNode.js

// tail
// lo W
// e.js

// Pieces 
// [ 'Hel' ]
// [ 'lo WNod' ]

// Messy example for raplacing a string,
// this wont be suggested
// _write(chunks, encoding, cb);



class DuplexStream extends Duplex {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.initVal = 'Hello world';
    }
    // it allows to init data in internal buffer
    _read() {
        this.push(this.initVal);
        this.push(null);
    }

    _write(chunks, encoding, cb) {
        fs.writeFile(chunks, this.initVal);
        cb();
    }
}
const strDups = new DuplexStream();


class DuplexStreamPipe2 extends Duplex {
    constructor(options = {}) {
        options.objectMode = true;
        super(options)
    }

    _write(chunks, encoding, cb) {
        console.log('Piping to stream 2');
        this.push(chunks);
        this.push(null);
        cb();
    }
}


class DuplexStreamPipe3 extends Duplex {
    constructor(dest, options ={}){
        options.objectMode = true;
        super(options);
        this.path = dest;
    }

    _write(chunks, encoding, cb) {
        console.log('Piping to stream 3');
        fs.writeFile(this.path, chunks);
        console.log('Succesfully write a file : ');
    }

}

// This chain pipes, demonstrate that using duplex can definitely connect all since
// piping means readable -> writable, since duplex is both [readable, writable] -> [readble, writable]
// it allows to pass through next


strDups.pipe(new DuplexStreamPipe2())
       .pipe(new DuplexStreamPipe3('ownStream.txt'));

// strDups.on('data', data => console.log('Data :: ', data));
// strDups.on('end', () => strDups.write('ownStream.txt'));

// This implies that it also needs some config handler which resulted in Transform and Passthrough

// transform allow us to use transform(), and also flush() before stream ended.
const replaceStream = new Transform({
    defaultEncoding: 'utf8',
    transform(chunk, encoding, cb) {
        const pieces = (tail + chunk).split(searchStr)
        // console.log('Pieces :: ', pieces);
        const lastPiece = pieces[pieces.length - 1]
        // console.log('Last piece:: ', lastPiece);

        const tailLen = searchStr.length - 1
        tail = lastPiece.slice(-tailLen)
        // console.log('Tail val ::', tail);
        pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
        // console.log('Pieces :: ', pieces);
        this.push(pieces.join(replaceStr))
        cb()
    },
    flush(cb) {
        // console.log('Tail val ::', tail)
        this.push(tail)
        cb()
    }
})


// replaceStream.write('Hello W');
// replaceStream.write('Node.js');
// replaceStream.end();


// replaceStream.on('data', chunk => console.log('Output :: ', chunk.toString()))
