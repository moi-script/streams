import { writeFile, watch, stat } from 'fs/promises';
import { createReadStream } from 'fs'; // returns stream


// createReadStream, createWriteStream, is for -> fs
// while fd.createReadStream(), -> File handle  


const ac = new AbortController();

const { signal } = ac;

// setTimeout(() => ac.abort(), 15000);

// triggers 
let times = 0
let interval = setInterval(async () => {
    await writeFile('app.log', times.toString());
    ++times;

    if (times === 5) {
        clearInterval(interval);
    }

}, 2000);




// however multiple instance of internal buffer
// and also multiple listener 
// solution -> .once('data');

const w = watch('app.log', { signal })

for await (const changes of w) {
    console.log('File change in', changes);
    const stream = createReadStream('app.log', {
        encoding: 'utf8',
        start: stat('./app.log').size
    });

    stream.once('data', chunk => {
        console.log('New log entry:', chunk);
    });


}



