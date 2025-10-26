

// console.log(new AbortController());

// const ac = new AbortController();

// const {signal} = ac;
// console.log(signal);
// // const {signal} = new AbortController();
// ac.abort();

// console.log(signal);




// const { watch } = require('node:fs/promises');

import { watch } from 'node:fs/promises';

const ac = new AbortController();
const { signal } = ac;
// setTimeout(() => ac.abort(), 15000);


(async () => {
  try {
    // waiting for abort controller to abort
    const watcher = watch('own.txt', { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})(); 