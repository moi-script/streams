import { open, stat } from 'fs/promises';
import chalk from 'chalk';
// promise / await




// get file length
// set stream encoding
// init progress = 0
// init data chunks
// read stream pause mode 
// check backpressure

async function transferFile(source, dest) {
    const readStreamFd = await open(source);
    const writeStreamFd = await open(dest, 'w');

    const readStream = readStreamFd.createReadStream({ highWaterMark: 16 });
    const writeStream = writeStreamFd.createWriteStream({ highWaterMark: 16 });
    readStream.setEncoding('utf8');

    const MAX_LENGTH = (await stat(source)).size;
    let progress = 0;

    readStream.on('readable', () => {
        let chunks = '';
        let data = ''
        while ((chunks = readStream.read()) !== null) {
            progress += chunks.length;
            data += chunks;

            console.log(chalk.red('Progress -- ' + ((progress / MAX_LENGTH) * 100).toFixed(2)) + '%' )
            const isFull = writeStream.write(data, 'utf8');

            if (!isFull) {
                readStream.pause();
                break;
            }
        }
    })

    writeStream.on('drain', () => {
        readStream.resume();
    });
    
    readStream.on('end', () => {
        console.log('Transfer Complete');
    })

    writeStream.on('error', err => console.log("Error :: ", err))
    readStream.on('error', err => console.log('Error :: ', err))
}



// Technology has b  -> length 16
// ecome an insepar -> length 16

transferFile('test.txt', 'result.txt')