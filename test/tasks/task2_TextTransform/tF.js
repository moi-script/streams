import fs from 'fs';
import { Transform } from 'stream';

// extends transform internals
class ToUpperText extends Transform {
    constructor(options) { 
        super({ ...options });
        this.upperText = ''
    }

    _transform(chunks, encoding, callback) {
        // encoding not supported
        const upper = (this.upperText + chunks).toUpperCase();
        this.push(upper);
        callback();
    }

    _flush(callback) {
        this.push(this.upperText);

        callback();
    }

}



//synchronous return modified  stream
 function streamToUpper(contents,  cb,) {
    const toUpperStream = new ToUpperText();

    toUpperStream.write(contents);

    // events
    toUpperStream.on('data', data => {
        cb(null, data);
    })
    toUpperStream.on('error', err => {
        cb(err, null);
    })
}

streamToUpper('hello world', (err, data) => {
    if(err) console.log('Error : ',err);

    console.log('result :: ', data.toString());
})