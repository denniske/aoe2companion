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

    const { path, data } = req.body;

    res.send('Hello World!');

    console.log('Received screenshot:', path);

    let filePath = './screenshots/' + path;
    await imageDataURI.outputFile(data, filePath);
});

app.listen(process.env.PORT || 3000, () => console.log(`Image server listening on port ${process.env.PORT || 3000}!`));
