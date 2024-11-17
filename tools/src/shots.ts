import sharp from 'sharp';
import tinify from 'tinify';

require('dotenv').config();

tinify.key = process.env.TINIFY_KEY;

async function addBorderToScreenshot(index: number) {
    const borderWidth = 2;

    let image = sharp(`screenshots/ios/screen-${index}.jpg`);
    let meta = await image.metadata();

    // 80 from top
    // 60 from bottom

    image = await image
        .extract({
            left: borderWidth,
            top: borderWidth + 80,
            width: meta.width - borderWidth*2,
            height: meta.height - borderWidth*2 - 80 - 60,
        })
        .extend({
            top: borderWidth,
            bottom: borderWidth,
            left: borderWidth,
            right: borderWidth,
        });

    await image.toFile(`screenshots/web/screen-${index}.jpg`);
}

async function addBorderToScreenshots() {
    for (let i = 0; i < 11; i++) {
        console.log("Add border to screenshot " + i);
        await addBorderToScreenshot(i);
    }
}

// addBorderToScreenshots();


async function addFrameToScreenshot(index: number) {
    let shot = sharp(`screenshots/ios/screen-${index}.jpg`).resize({ width: 1080 });
    let frame = sharp(`../website2/public/ios-frame.png`);

    let image = sharp({create: { width: 1242, height: 2477, background: '#00000000', channels: 4 }});

    image = await image
        .composite([
            { input: await shot.toBuffer(), left: 84, top: 64 },
            { input: await frame.toBuffer() },
        ]);

    image = sharp(await image.toFormat('png').toBuffer()).resize({ width: 800 });

    await image.toFile(`screenshots/ios/screen-${index}-out.png`);
}

async function addFrameToScreenshots() {
    for (let i = 0; i < 1; i++) {
        console.log("Add border to screenshot " + i);
        await addFrameToScreenshot(i);
    }
}

addFrameToScreenshots();





async function tinifyScreenshot(index: number) {
    let inputPath = `screenshots/web/screen-${index}.jpg`;
    const source = tinify.fromFile(inputPath);
    await source.toFile(inputPath);
}


async function tinifyScreenshots() {
    for (let i = 0; i < 11; i++) {
        console.log("Tinify screenshot " + i);
        await tinifyScreenshot(i);
    }
}

// tinifyScreenshots();
