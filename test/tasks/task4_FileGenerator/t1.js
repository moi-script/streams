
import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// dummy data for new file created
function generateRandomContents(size) {
    if (size > 0) {
        return Array.from({ length: size }, () => {
            const random = Math.floor(Math.random() * (120 - 65) + 65);
            return String.fromCharCode(random);
        }).join('')
    }

    return new Error('Invalid size').message;
}

// sanitizer input type strict checker
function handleFolderName(folderName) {
    try {
        return Array.isArray(folderName.split(''));
    } catch (err) {
        return false;
    }
}


// separated folder creation and file creation

// create folder
async function createFoler(folderName) {
    const url = new URL('./' + folderName, import.meta.url);
    const validPath = fileURLToPath(url);

    await mkdir(validPath, { recursive: true })
    // return valid file path for new folder
    return validPath;
}


// generation of folder with dummy files

async function generateDirs(folderName, fileCounts, contentSize) {
    // needs to sanitize foldername 
    const isValidFolder = handleFolderName(folderName);

    // strict handler

    if (isValidFolder && (fileCounts > 0) && (contentSize > 0)) {
        try {
            const newFolderPath = await createFoler(folderName);
            generateRandomFiles(newFolderPath, fileCounts, contentSize);

        } catch (err) {
            console.log('Error in creating a folder (mkdir)', err);
        }
    } else {
        return new Error('Invalid input').message;
    }

}

function generateRandomFiles(filepath, fileCounts, contentSize) {
    console.log('Path returned :: ', filepath);
    let files = 0
    while (files < fileCounts) {
        const pathFile = path.join(filepath, `newFile${files}.txt`);
        try {
            const fileContents = generateRandomContents(contentSize);
            fs.writeFile(pathFile, fileContents, (err) => {
                if (err) throw new Error('Writing file error', err);
                console.log('File created successfully!');
            });
        } catch (err) {
            console.log('Failed to generate file contents', err);
        }
        ++files;
    }
}

console.log(await generateDirs('test', 10, 300));
// console.log(import.meta.url);

