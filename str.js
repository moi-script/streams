
import fs from 'fs';


// await a file handle
const fd = await fs.promises.open('readableFile.txt');


// reading file stream -> readableFlowing = null
const strm = fd.createReadStream({encoding : 'utf8'});
const wtr = fs.createWriteStream('writableFile.txt');
// flowing mode 

// strm.on('data', data => {
//     console.log('Streams :: ', data);

//     wtr.write(data);
// })


// strm.on('end', () => {
//     console.log('Stream read is done.')
    
// });



// test | without attaching methods or events it will be null
console.log(strm.readableFlowing);

// test resume | attaching resume or pipe or data events will make it true

strm.resume(); // strm.pipe()
console.log(strm.readableFlowing);

// test pause | attaching pause
strm.pause() // strm.unpipe()
console.log(strm.readableFlowing);








