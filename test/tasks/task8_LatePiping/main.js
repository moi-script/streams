import { PassThrough } from "stream";
import { createReadStream } from "fs";
import { createBrotliCompress } from "zlib";

// late piping
// invoking a function that it needs to be activated when a certain event triggers

// Note that our pipeline will also close the contentStream when the processing completes,
// which will indicate to the upload() function that all the content has been fully consumed

const contentStream = new PassThrough();


// using a content stream as placeholder, we can rely on event such as end, in order to control 
// the asynchronous process of stream

// here in function I didnt use filepath, since we dont need to show the process,
// is suppose to he a server side but just a bare demonstration of late piping
function upload(filepath, contentStream) {
    let data = ''
    return new Promise((acc, rej) => {
        contentStream.on('data', chunks => {
            data += chunks.toString();

            // needs some connection here to where to write here

            const isFull = contentStream.write(data);
            if (!isFull) {
                console.log('Back pressure');
                contentStream.pause();
            }
        })

        contentStream.end();
        contentStream.on('end', () => acc(true))
        contentStream.on('drain', () => contentStream.resume())
        // contentStream.on('end', () => acc(true));
        contentStream.on('error', err => rej(err))
    })
}

upload('test.txt' + '.br', contentStream).then(val => {if (val) console.log('Done.')})
                                         .catch(err => console.error(err))

createReadStream('dummy.txt').pipe(createBrotliCompress())
                             .pipe(contentStream)



function uploadStream(filename){
    const connector = new PassThrough();
    upload(filename, connector);

    return connector;
}

const uploadStr = uploadStream('file.txt'); // will initiate and run the upload function

// uploadStr.write(chunks) ---> can be trigger later, a determinator for the upload connector stream






