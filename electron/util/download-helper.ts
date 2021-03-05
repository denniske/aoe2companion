import * as request from 'request';
import * as fs from 'fs';

export function downloadFile(file_url , targetPath) {
    return new Promise(((resolve, reject) => {
        let receivedBytes = 0;
        let totalBytes = 0;
        let lastProgressPercentage = -1;

        const req = request({
            method: 'GET',
            uri: file_url,
        });

        var out = fs.createWriteStream(targetPath);
        req.pipe(out);

        req.on('response', function ( data ) {
            totalBytes = parseInt(data.headers['content-length']);
        });

        req.on('data', function(chunk) {
            receivedBytes += chunk.length;
            const progressPercentage = Math.round((receivedBytes * 100) / totalBytes);
            if (progressPercentage > lastProgressPercentage) {
                lastProgressPercentage = progressPercentage;
                console.log(progressPercentage + "% | " + receivedBytes + " bytes out of " + totalBytes + " bytes.");
            }
        });

        req.on('end', function() {
            resolve();
        });
    }));
}
