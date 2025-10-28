import Readable from 'stream';
import fs from 'fs';
import { readFile }  from 'fs/promises';

let contents = [];

const fd = await fs.promises.open('tst.csv');
const fdJSOn = await fs.promises.open('res.json', 'w');
// const csvStreamer = fd.createReadStream({ highWaterMark: 16 });
// const jsonWriter = fdJSOn.createWriteStream({ highWaterMark: 16 });


// convert into own stream 

function searchMiscCount(str) {
    return (str.includes('\n') && str.includes(' ')) ? true : false;
}

// console.log(searchMiscCount(text))
let data = ''

function splitNewLine(str) {
    let pos = str.indexOf('\n');
    return str.slice(pos + 1);
}

function getBeforeNewLine(str, lastIndex) {
    return str.slice(0, lastIndex);
}

function getHeader(arr) {
    // get the first value from array
    let headArray = arr[0].split(',');
    return headArray;
}

function getRows(arr) {
    // get the rest after first index
    let rows = arr.slice(1);
    return rows;
}

function createTableObjJSON(headers, row) {
    let headerRowObj = headers.map((val, index) => {
        const headObj = { [val]: [] }
        getItems(row, index).forEach((item) => {
            headObj[val].push(item);
        })
        return headObj;
    }).flat();

    return JSON.stringify({ headerRowObj }, null, 2);

}

function getItems(row, index) {
    return row.map(items => items.split(',')[index]);
}
// concatenate until newline is reach
// reasigned the new row with a separated value of new line then concatenated the next

function separateNewLine(data) {
    const newLineIndex = data.split('').indexOf('\n') + 1;
    return getBeforeNewLine(data, newLineIndex);
}


csvStreamer.on('data', (chunks) => {
    data += chunks.toString();
    if (data.match('\n')) {
        const partition = separateNewLine(data);
        contents.push(partition);
    }
    // re assign the data after a newline value
    data = splitNewLine(data);

   
})

csvStreamer.on('end', () => {
    let header = getHeader(contents);
    let rows = getRows(contents);

    let tableObject = createTableObjJSON(header, rows);

    jsonWriter.write(tableObject);

    // console.log('Result :: ', tableObject);
})





// jsonWriter.on('error', err => console.error(err))

// needs to have finish event,

// jsonWriter.on('finish', () => {
//     console.log('Sucessfully writen to res.json');
// })

class ParseCsv extends Readable {
    constructor(dest, options) {
        super(options);
        this.path = dest;
        this.data = '';
    }

    async streamFileContents() {
        const csvContents = await readFile(this.path, 'utf8');
        this.push(csvContents);
        this.push(null);
    }

    async readFileStream() {
        this.on('data', data => {
            data += chunks.toString();
    if (data.match('\n')) {
        const partition = separateNewLine(data);
        contents.push(partition);
    }
    // re assign the data after a newline value
    data = splitNewLine(data);
        })
    }

}


// what we are gonna push in internal buffer is the json parse CSV after



console.log('Result ::', csvContents);







// ||  IGNORE THIS, IT WAS A MANUAL ALGORITHM PROCESS 

 // first consume --- Name,Gender,Coun // second condition
    //second consume --- try,Age // first condition \n
    // with  Liam An,  in next row 

    // const row = chunks.toString() -- try,Age\nLiam An
    //Liam Anderson
    // cut the new line
    // get the left part
    // concatenate into data
    // re assign the data into the right
    // 

    // while ((chunks = csvStreamer.read()) !== null) {
    //    data += chunks.toString();
    //    console.log(chunks.toString().length, data);
    //    if(chunks.toString().match(/\n/g)){
    //     data += chunks.toString();

    //     break;
    //    }
    // }