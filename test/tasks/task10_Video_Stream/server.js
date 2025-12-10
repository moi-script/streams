import express from 'express';
import cors from 'cors';
import multer from 'multer';
const app = express();

app.use(express.json());
app.use(cors());


const upload = multer({dest : '/uploads'})


app.post('/upload', upload.single('video'), (req, res) => {

    console.log('Request :: ', req.file);
    
})