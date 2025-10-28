import { readFile, writeFile } from 'fs/promises';
import { Readable } from 'stream';

// inherit the readable object 
// it allowes to openly use the both streams for a single internal buffer
// huge usage of array methods
// down side - lacks threshold limit

class ParseCsv extends Readable {
    constructor(source, dest, options) {
        super(options);
        this.path = source;
        this.destination = dest;
        this.data = '';
        this.contents = [];

        // init the function 
        this.readFileStream();
    }
    async getFileData(source) {
        return await readFile(source);
    }
    splitNewLine(str) {
        let pos = str.indexOf('\n');
        return str.slice(pos + 1);
    }

    getBeforeNewLine(str, lastIndex) {
        return str.slice(0, lastIndex);
    }
    getHeader(arr) {
        // get the first value from array
        let headArray = arr[0].split(',');
        return headArray;
    }
    getRows(arr) {
        // get the rest after first index
        let rows = arr.slice(1);
        return rows;
    }
    createTableObjJSON(headers, row) {
        const headerRowObj = headers.map((val, index) => {
            const headObj = { [val]: [] }
            this.getItems(row, index).forEach((item) => {
                headObj[val].push(item);
            })
            return headObj;
        }).flat();

        return JSON.stringify({ headerRowObj }, null, 2);
    }

    getItems(row, index) {
        return row.map(items => items.split(',')[index]);
    }

    // concatenate until newline is reach
    // reasigned the new row with a separated value of new line then concatenated the next
    separateNewLine(data) {
        const newLineIndex = data.split('').indexOf('\n') + 1;
        return this.getBeforeNewLine(data, newLineIndex);
    }

    async _read() {
        console.log('click2')
        this.push(await this.getFileData(this.path));
        this.push(null);

        // this.on('data', chunks => console.log(chunks));

        // this.push(null); // might get stop after internal buffer consumed
    }

    readFileStream() {
        console.log('click1')

        this.on('data', chunks => {

            this.data += chunks.toString(); // this will consume everything wihout threshold limit;

            if (this.data.match('\n')) {
                const partition = this.separateNewLine(this.data);
                this.contents.push(partition);
            }
            // re assign the data after a newline value
            this.data = this.splitNewLine(this.data);
        })

        // || We can do this internally, but it might be good to show it into external
        // this.on('end', async () => {
        //     const header = this.getHeader(this.contents);
        //     const rows = this.getRows(this.data.split('\n'));
        //     const tableObject = this.createTableObjJSON(header, rows);

        //     try {
        //         await writeFile(this.destination, tableObject);
        //         console.log('Succesfuly converted into file');
        //     } catch (err) {
        //         console.log('Unable to write a json.');
        //     }
        // })
    }
}

export function converCSV(source, dest) {
    const parse = new ParseCsv(source, dest);

    parse.on('end', async () => {
        const header = parse.getHeader(parse.contents);
        const rows = parse.getRows(parse.data.split('\n'));
        const tableObject = parse.createTableObjJSON(header, rows);

        try {
            await writeFile(parse.destination, tableObject);
            console.log('Succesfuly converted into file');
        } catch (err) {
            console.log('Unable to write a json.');
        }
    })
    return 1;
}

