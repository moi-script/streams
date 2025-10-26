import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import { watch } from 'fs/promises';
const rl = readline.createInterface({ input, output }); // this search a properties input, output, thats why


// it should be rename locally 
const ac = new AbortController();
const { signal } = ac; 

const fd = await fs.promises.open('own.txt', 'w');
const steamOwn = fd.createWriteStream({ highWaterMark: 16 });

// IIFE makes a watch for files
(async () => {
    try {
        // using try make it catch the erorr on whatever kind of package it was
        const watchFile = watch('own.txt', {signal});

        for await (const events of watchFile) {
            console.log('File changed in.', events.filename);
            return;
        }
    } catch(err) {
        if(err.name === 'AbortError'){
            return;
        }
        throw err;
    } 
})()


// accept an input
// write to file
// track changes in file

// needs to have own readStream
// needs to concatenate a new updated write stream

async function acceptInput() {
    let attempt = 0;

    while (attempt < 3) {
        const ans = await rl.question('type anything -> \n');
        const resWrite = steamOwn.write(ans + '\n');


        if (!resWrite) {
            console.log('Threshold limit');
        }

        console.log('Answer :', ans);
        ++attempt;
    }

    rl.close();
    steamOwn.end();
}
acceptInput();

// close, drain, finish

// steamOwn.write('Helllo world');

steamOwn.on('finish', () => console.log('Succesfully written.'))
steamOwn.on('error', err => console.error(err))
