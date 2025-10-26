// get the list of file from a certain path 

// This is prototype before creating a str.js or FileMerger in task, 
// this simulate a simple file dir filtering and readings


import fs from 'fs';
import { opendir, readdir } from 'fs/promises';
import { fileURLToPath } from 'url';


// for a simple project a single level dir subs only

function filterRealFiles(subDirList) {
    const filesPattern = /\./g;
    return subDirList.filter(files => files.match(filesPattern) && files !== 'mr.js'); // static test to filter mr.js file
}

// async function populateDataStreams(data, source) {
//     const readStream = fs.createReadStream(source, { highWaterMark: 16 });
//     let contents = data;

//     return new Promise((acc, rej) => {
//         readStream.on('data', chunks => {
               
//             contents.chnks += chunks.toString();
//         })
//         readStream.on('end', () => acc(contents));
//         readStream.on('error', (err) => rej(err));
//     })
// }

async function getFilesContentStream(dir) {

    const subDirList = await readdir(dir);
    const sourceList = filterRealFiles(subDirList);

    let data = { chnks: '' };

    // generate async iterator
    let processStreams = Array.from({length : sourceList.length}, () => {
        return populateDataStreams;
    })

    // didnt work, wont await it <---
    console.log('Process streams', processStreams);
    return new Promise(async (acc, rej) => {
        let fileIndex = 0;
        for await (const promisePopulate of processStreams) {
            promisePopulate(data, sourceList[fileIndex]).then(data => {
                console.log('Finishes reading', sourceList[fileIndex], ' -> ', data);
                acc(data);
            }).catch(err => rej(err))

            ++fileIndex;
        }

        acc(data);
    })
}

// await getFilesContentStream('./').then(data => console.log(data)).catch(err => console.error(err));






// try {
//     const valid = fileURLToPath(new URL(import.meta.url));

//     const list = valid.split('\\').filter(item => (item != 'mr.js')).join('/');
//     console.log(list)
//     const subDirList = await readdir('./');

//     console.log(filterRealFiles(subDirList));


//     // separate folder and file



//     // for await (const dirent of dir){
//     //     console.log(dirent.name);
//     // }

//     // for (const file of dir) {
//     //     console.log(file);
//     // }
// }
//  catch(err) {
//     console.error(err);
//  }


// regex search for period char





// Recursion test 



function f1(size) {
    if(size <= 5) {
        ++size;
       return f1(size)
    } else {
        return size;
    }
}


console.log(f1(0));