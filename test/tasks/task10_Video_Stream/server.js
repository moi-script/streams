import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
const app = express();

app.use(express.json());
app.use(cors());


// const upload = multer({dest : 'uploads/'})


const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename : function (req, file, cb) {

        const ext = path.extname(file.originalname);

        const uniqeName = `${file.fieldname}-${Date.now()}${ext}`

        cb(null, uniqeName);
    }
})


const upload = multer({storage : storage})


app.post('/upload', upload.single('video'), (req, res) => {
    console.log('Request :: ', req.file);
})


app.listen(3000, () => console.log('Running at http://localhost:3000'))