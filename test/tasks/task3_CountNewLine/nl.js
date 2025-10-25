import { open } from 'fs/promises';

async function fileLineCount(source, cb) {
    const readFd = await open(source);

    const readStream = readFd.createReadStream({highWaterMark : 16});
    let lineCount = 0;
    const newLinePatter = /\n/g;
    readStream.on('readable', () => {
        let chunks = '';
        let data = ''
        while ((chunks = readStream.read()) !== null) {
            data += chunks.toString();
            if (data.match(newLinePatter)) {
                ++lineCount;
            }
        }
    })
    // readStream.on('end', () => console.log('File count line is :: ', lineCount))
    readStream.on('error', err => cb(err, null))
    readStream.on('end', () => cb(null, (lineCount + 1)));
}


await fileLineCount('test.txt', (err, data) => {
    if(err) console.log('There was an error :: ', err);


    console.log('Result :: ', data);
});


