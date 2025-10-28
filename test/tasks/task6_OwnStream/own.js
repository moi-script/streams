

import { Readable, Writable } from 'stream';
import Chance from 'chance';
import fs, { mkdir } from 'fs/promises';
import path from 'path';
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

        if(this.switch) {
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
    objectMode : true,
    write(chunks, encoding, cb) {
        // const chunksObject = chunks.toString();

        console.log('Chunks recieved value :: ', chunks);
        const projectFolder = new URL( './test', import.meta.url);
        const validFilePath = fileURLToPath(projectFolder);
        
        // test object mode
        // console.log("Object mode :: ", chunks.message);

        // create folder and file
        mkdir(projectFolder).then(() => fs.writeFile(path.join(validFilePath, 'newTXT.txt'), JSON.stringify(chunks))).then(() => cb()).catch(err => console.error(err))
    }
});


// might be better
const pipingReadStreamInstance = new Readable({
    objectMode : true,
    read() {
        // always string or buffer
        this.push(JSON.stringify([{message1 : 'hello'}, {message2 : 'world'}]));
        this.push(null);
    }
})

pipingReadStreamInstance.pipe(testWritableInstance);



// NEXT TO IMPLEMENT HERE IS DUPLEX AND TRANSFORM 

// -- DUPLEX can be both writable and readable -> meaning we can use both, .write() -> cb, 'data' event -> this.push()

// testWritableInstance.write({message : 'Hi there file'});

// const projectFolder = new URL( './test', import.meta.url);
//         console.log('Path created :: ', projectFolder);

// mkdir(projectFolder).then(() => fs.writeFile(path.join(fileURLToPath(projectFolder), 'testLol.txt'), 'hello world'));

// console.log('Valid file path :: ', fileURLToPath(projectFolder));


