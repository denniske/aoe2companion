import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export function createExpress() {
    const app = express();
    app.use(bodyParser.json({limit: '100mb'}));
    app.use(cors());

    app.get('/health', (req, res) => {
        res.send({ status: 'OK' });
    });

    return app;
}
