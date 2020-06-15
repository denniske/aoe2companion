import express from 'express';
// @ts-ignore
import imageDataURI from "image-data-uri";
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', async (req, res) => {
    console.log(req.body);

    const { name, data } = req.body;

    res.send('Hello World!');

    console.log('Received image:', name);

    let filePath = './images/' + name;
    await imageDataURI.outputFile(data, filePath);
});

app.listen(3000, () => console.log('Image server listening on port 3000!'));
