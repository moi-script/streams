import { convertCSVtoJSON } from "./parser.js";
import { promisify } from "../../../../zlib/util/promisify.js";
import console from 'console';
const promiseCsv = promisify(convertCSVtoJSON);

const jsonCsv = await promiseCsv('tst.csv');

const { headerRowObj } = JSON.parse(jsonCsv);


// get the key list
function getKeyList(testObjArr) {
    return testObjArr.map(val => {
        return Object.keys(val).flat();
    }).flat()
}

function getValueList(index, testObject) {
    return testObject.filter((_, i) => i === index)
        .map(value => Object.values(value).flat()).flat()
}


// init an object empty

// loops to header
// init row value

// saved to an object

// increment header index
// stay the row value

// push to the same object

// after header reach to last
// if the row value is greater than 0
// row value is back to o 

// push to the same object 
// push to the array all object list

// const testObject = [
//     { 'Name': ['Name1', 'Name2', 'Name3'] },
//     { 'Age': ['Age1', 'Age2', 'Age3'] },
//     { 'Gender': ['Gender1', 'Gender2', 'Gender3'] }
// ]

export function generateTableObject(jsonCsv) {
    let emp = {}; 
    let newArr = [];
    const headerlist = getKeyList(jsonCsv);
    const rowLength = getValueList(1, jsonCsv).length; // can be simplified 
    let rowStart = 0;

    while (rowLength > rowStart) {
        headerlist.forEach((val, index) => {
            const rowList = getValueList(index, jsonCsv); // do a row loops again may slow it
            emp = { ...emp, [val]: rowList[rowStart] } // re spread in loops affect memory
        })
        newArr.push(emp);
        rowStart++;
    }
    return newArr

}
// console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
console.table(generateTableObject(headerRowObj));


// By chat gpt refactoring; -- needs 
// function generateTableObject(jsonCsv) {
//   const headerList = getKeyList(jsonCsv);
//   const columnValues = headerList.map((_, index) => getValueList(index, jsonCsv));
//   const rowCount = columnValues[0].length;

//   const newArr = [];

//   for (let row = 0; row < rowCount; row++) {
//     const emp = {};
//     headerList.forEach((key, colIndex) => {
//       emp[key] = columnValues[colIndex][row];
//     });
//     newArr.push(emp);
//   }

//   return newArr;
// }



