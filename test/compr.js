import { createReadStream , createWriteStream } from 'fs';
import { createGzip } from 'zlib';


const filename = process.argv[2];

// can remove the extname
createReadStream(filename).pipe(createGzip())
                          .pipe(createWriteStream(`${filename}.gz`))
                          .on('finish', () => console.log('Succesfully compressed ', filename));



