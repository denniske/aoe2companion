import {app, protocol} from 'electron';
import * as url from 'url';
import * as path from 'path';
const slash = require('slash');

export function initInterceptor() {
    // file:///C:/Users/Dennis/Projects/aoe2companion/web-build/index.html
    const urlStr = url.format({
        pathname: path.join(__dirname, '../../web-build/index.html'),
        protocol: 'file:',
        slashes: true,
    });

    // file:///C:
    const fileRootUrl = slash(urlStr).substr(0, 10);

    // file:///C:/Users/Dennis/Projects/aoe2companion/web-build
    const appRootUrl = slash(urlStr).replace('/index.html', '');

    console.log('');
    console.log('---');
    console.log('');

    protocol.interceptFileProtocol(
        'file',
        (request, callback) => {
            console.log(' ');
            console.log(request.url);

            let url = request.url;

            if (!url.startsWith(appRootUrl)) {
                console.log('tryreplace', fileRootUrl, appRootUrl, url);
                url = url.replace(fileRootUrl, appRootUrl);
            }

            // if (url.startsWith('file:///C:/static')) {
            //     url = url.replace('file:///C:/static/', 'file:///C:/Users/Dennis/Projects/aoe2companion/web-build/static/');
            // }
            // if (url.startsWith('file:///C:/fonts')) {
            //     url = url.replace('file:///C:/fonts/', 'file:///C:/Users/Dennis/Projects/aoe2companion/web-build/fonts/');
            // }

            // console.log('->', url);
            console.log('->', url);

            callback({url, path: url.substr(7)});

            // const url = request.url.substr(7) // strip "file://" out of all urls
            // if (request.url.endsWith(indexFile)) {
            //     console.log('->', url);
            //     callback({ path: url })
            // } else {
            //     console.log('->', path.normalize(`${__dirname}/${htmlRootDir}/${url}`));
            //     callback({ path: path.normalize(`${__dirname}/${htmlRootDir}/${url}`) })
            // }
        },
        // error => console.error(error)
    );
}
