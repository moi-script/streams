import fs from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import url from  'url';
import path from 'path';
// String -> number
// Number -> String
// // console.log(String.fromCharCode(68));


// path
// fs 

function stringGen(size) {
    const ars = Array.from({length : size}, () => {

        const randomNums = Math.floor(Math.random() * (90 - 65) + 65);
        return String.fromCharCode(randomNums);
    })
    return ars.join('');
}



async function fileGeneration (counts) {
    const url = new URL('./generated', import.meta.url);
    // const pathDir = path.dirname(url);
    console.log('url', url)

    try {
    const createDir = await mkdir(url, {recursive : true});

    for(let i = 0; i< counts; i++) {
        await writeFile(url.pathname + `/newFile${i}.txt`, 'hello');
    }


    console.log('Succesfully created a list of file ');
    } catch(err) {
        console.log(err);
    }

}

await fileGeneration(10);



// const path = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash')
// protocol: 'https:',
//   slashes: true,
//   auth: 'user:pass',
//   host: 'sub.example.com:8080',
//   port: '8080',
//   hostname: 'sub.example.com',
//   hash: '#hash',
//   search: '?query=string',
//   query: 'query=string',
//   pathname: '/p/a/t/h',
//   path: '/p/a/t/h?query=string',
//   href: 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'



const newPath =  new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');




const trypath = new URL('./hello', import.meta.url);

// console.log('Try ', trypath);

const myUrl = new URL(import.meta.url);
const pathName = myUrl.pathname;

// convern to Path nodejs

const basename = path.basename(pathName);
const dirname = path.dirname(pathName);
const extname = path.extname(pathName);
const pars = path.parse(pathName);





// console.log(myUrl.pathname); // can be use in path api
// // console.log(import.meta.url);
// console.log('Basename :: ', basename);
// console.log('Dirname :: ', basename);
// console.log('Parse :: ', pars);


// // console.log('Basename :: ', basename);
// // console.log('Basename :: ', basename);
// // console.log('Basename :: ', basename);







// const randomNo = Math.floor(Math.random() * (130, ));

//  return Math.random() * (max - min) + min;


// console.log(String.fromCharCode(65 + 25));
// console.log(stringGen(400));