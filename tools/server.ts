import express from 'express';
// @ts-ignore
import imageDataURI from "image-data-uri";
var cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());


const GIFEncoder = require('gifencoder');
const encoder = new GIFEncoder(684, 387);
const pngFileStream = require('png-file-stream');
const fs = require('fs');
const path = require('path');



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', async (req, res) => {

    // console.log(req.body);

    let images = req.body.images;

    res.send('Hello World!');


    const directory = 'images';
    const files = fs.readdirSync(directory);

    for (const file of files) {
        fs.unlinkSync(path.join(directory, file));
    }

    let i = 0;
    for (let image of images) {
        let filePath = './images/frame' + (i++).toString().padStart(4, "0");
        await imageDataURI.outputFile(image, filePath);
    }

    const stream = pngFileStream('images/frame*.png')
        .pipe(encoder.createWriteStream({ repeat: 1, delay: 100, quality: 1, transparent: '#0F0' }))
        .pipe(fs.createWriteStream('images/animated.gif'));

    stream.on('finish', async function () {
        console.log("FINISHED");
        // Process generated GIF



        // try {
        //     fs.unlinkSync('gifs/animated.gif');
        // } catch (e) {
        // }
        //
        // fs.copyFileSync('images/animated.gif', 'gifs/animated.gif');
        //
        // fs.unlinkSync('images/animated.gif');

        // fs.unlink('images/animated.gif', (err: any) => {
        //     if (err) throw err;
        // });

        // const directory = 'images';
        //
        // fs.readdir(directory, (err: any, files: any[]) => {
        //     if (err) throw err;
        //
        //     for (const file of files) {
        //         fs.unlink(path.join(directory, file), err => {
        //             if (err) throw err;
        //         });
        //     }
        // });

        //stream.destroy();
    });



});



app.listen(3000, () => console.log('Example app listening on port 3000!'));
