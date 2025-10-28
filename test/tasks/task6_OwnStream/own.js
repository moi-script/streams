

import { Readable, Writable } from 'stream';
import Chance from 'chance';
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


const test = new TestReadableInstance();

test.print();








// try to create a simple project
// -- accepting input from terminal -> write to a log file, and watch an update that is maked
// using terminal readline


// streams.pipe(writetable);