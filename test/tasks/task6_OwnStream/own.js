

import {Readable, Writable} from 'stream';

// -- The reason why we read a stream is to write it to writable


function delay() {
    return new Promise((acc) => setTimeout(() => acc('Hello world'), 3000));
}
// const del = delay();


// del.then(val => console.log(val));

const streams = new Readable({
    async read() {
        this.push(await delay());
        // await delay();
        this.push(null);
    }
})

const writetable = new Writable({
    objectMode : true,
    write(chunks, encoding, cb) {
        console.log(chunks); //  // writetable.write('hello')
        cb()
    }
})

// try to create a simple project
// -- accepting input from terminal -> write to a log file, and watch an update that is maked
// using terminal readline


streams.pipe(writetable);