import chalk from 'chalk';
import fs from 'fs';
// import fs from 'fs/promises';


// another way is set timeout; 

// needs refactor to more comprehensive  
let globalFileContent = { contents: '' };
const files = ['t1.txt', 't2.txt']; // test init files, also we can use the file generator from previous project 


// needs to convert into promise;
function getFileContent(source) {
    // console.log('Source :: ', source);
    const readStream = fs.createReadStream(source, { highWaterMark: 16 });
    let data = ''
    return new Promise((acc, rej) => {
        readStream.on('readable', () => {
            let chunks = ''
            while ((chunks = readStream.read()) !== null) {
                data += chunks.toString();
            }
        })
        readStream.on('end', () => {

            // console.log('Finish reading', source);
            // console.log('Contents :: ', data)
            acc({ result: data });
        })

        readStream.on('error', (err) => rej(err))
    })
}

function* gen(fileList) {
    const asyncReadStream = Array.from({ length: fileList.length }, () => {
        return getFileContent;
    })
    for (const asyncStream of asyncReadStream) {
        yield asyncStream;
    }
}

let filePos = { count: 0 };

// recusion for looping through each stream async iterator
async function processLoops(filePos, fileList, processList, globalFileContent) {

    const itemProcess = processList.next().value;


    if (itemProcess) {
        const processResult = await itemProcess(fileList[filePos.count]);
        globalFileContent.contents += processResult.result;

        if (filePos.count <= fileList.length) {
            filePos.count++;
            return processLoops(filePos, fileList, processList, globalFileContent);
        }
        // after process loops we can use the file creation and  fileContentsTransfer
    }
    return globalFileContent.contents;
}



// call
// const output = await processLoops(filePos, files, gen(files), globalFileContent);
// console.log('Next output :: ', output);


async function MergeFile(filePos, files, globalFileContent) {
    const genFiles = gen(files);

    const data = await processLoops(filePos, files, genFiles, globalFileContent);
    writeFileContents(data, 'MergeFile.txt');
}
await MergeFile(filePos, files, globalFileContent);


function writeFileContents(data, dest) {
    
    fs.writeFile(dest, data, (err) => {
        if(err) new Error('Unable to write a file');

        console.log(chalk.green('Succesfully Merge a file'));
    });

}

// function resProm() {
//     return new Promise((acc, rej) => {
//         acc({data : 'he'});
//     })
// }

// const asyncProcess = gen(files);

// the internal buffer end event  wont wait
// the source item in file list is faster than the internal buffer consume previous data

// async function iterateProcess(globalFileContent, sourceList) {
//     let fileContents = globalFileContent;
//     let filePos = 0;
//     let isDone = false;
//     const processList = gen(sourceList);

//     for await (const process of processList) {

//         process(fileContents, sourceList[filePos]).then(data => {
//             console.log('Result :: ', data);
//         }).catch(err => console.error(err));

//         ++filePos;
//     }
// }

// needs delayed loops

// await iterateProcess(globalFileContent, files);

// function interValLoop(asyncList, fileSourceList) {
//     let filePos = 0;


//     let interval = setInterval(() => {


//         if(filePos > fileSourceList.length){
//             clearInterval(interval);
//         }

//         ++filePos;
//     }, 1000);
// }


// console.log(asyncProcess.next());


// console.log(gen().next());


// function* testGen() {
//     yield 1;
//     yield 2;
//     yield 3;
//     yield 4;

//     return 5

// }

// const item = testGen();

// console.log(item.next());
// console.log(item.next());
// console.log(item.next());
// console.log(item.next());
// console.log(item.next());

// for(const g of gen){
//     console.log(g);
// }